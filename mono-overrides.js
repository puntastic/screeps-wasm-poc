// Mono makes a few assumptions about the environment it is placed in.
// Fortunately is allows for overriding of many of its functions.
//
// In particular i've attempted to:
//		Strip out as much async as I can
//		Provide alternate file loading mechanisms (fetch etc. is not available. only require)

module.exports = function(overriding, wasmFilename, dependencyFiles)
{
	overriding['instantiateWasm'] = function(info, receiveInstance, enableDebugging)
	{
		Module['info'] = info;
		Module['rcvi'] = receiveInstance;
		
		return false;
		const binary = require(wasmFilename);
		const mod = new WebAssembly.Module(binary);
		const asm = new WebAssembly.Instance(mod, info);
		
		// XXXX: recieveInstance() sets the Module.asm but it is immediately overrided by 'createAsm' as 'false'
		// if the asm is also not returned out of this function
		recieveInstance(asm);
		
		console.log(Game.cpu.getUsed());
		return asm.exports;
	}
	
	//copied from mono_load_runtime_and_bcl without environment specific stuff & async
	overriding['onRuntimeInitialized'] = function ()
	{
		var allLoaded = true;
		var loadedFiles = [];
		
		var addAssembly = Module.cwrap ('mono_wasm_add_assembly', null, ['string', 'number', 'number']);
		var loadRuntime = Module.cwrap ('mono_wasm_load_runtime', null, ['string', 'number']);
		
		for(let filename of dependencyFiles)
		{
			console.log("MONO_OVERRIDES: Loading " + filename);
			var blob;
			
			try { binary = require(filename); }
			catch(ex) 
			{
				console.log("MONO_OVERRIDES: Failed..."); 
				allLoaded = false;
				continue;
			}
			
			var asm = new Uint8Array(binary)
			var memory = Module._malloc(asm.length);
			var heapBytes = new Uint8Array(Module.HEAPU8.buffer, memory, asm.length);
			
			heapBytes.set(asm);
			addAssembly(filename, memory, asm.length);
			loadedFiles.push(filename);
			
			//console.log("MONO_OVERRIDES: Success...");
		}
		
		if(!allLoaded)
		{
			console.log("MONO_OVERRIDES: One or more modules failed to instantiate. Aborting mono init...");
			return;
		}
		
		MONO.loaded_files = loadedFiles;
  		//var loadRuntime = Module.cwrap ('mono_wasm_load_runtime', null, ['string', 'number']);
		//try 
		//{
  			loadRuntime ("", 1);
  		//}
		//catch (ex) 
		//{
  		//	print ("MONO_OVERRIDES: load_runtime () failed: " + ex);
  		//	var err = new Error();
  		//	print ("MONO_OVERRIDES: Stacktrace: \n");
  		//	print (err.stack);
		//
  		//	var wasm_exit = Module.cwrap ('mono_wasm_exit', null, ['number']);
  		//	wasm_exit (1);
  		//}
		
		
		MONO.mono_wasm_runtime_ready ();
		//loaded_cb ();
	}
}