module.exports = function()
{
	if(global.Module) 
	{ 
		console.log("Mono has already been loaded once. Aborting...");
		return;
	}
	
	if(Game.cpu.bucket < 500) 
	{ 
		console.log("Not enough cpu to safely instantiate mono. Aborting..."); 
		return;
	}
	
	console.log("Setting up mono overrides");
	
	global.performance = { now: Date.now };
	global.print = /*console.warn =*/ console.log;
	global.Module = 
	{
		noFSInit: true
	}
	
	require('mono-overrides')(global.Module, "mono.wasm", [ "sample.dll","mscorlib.dll","System.Net.Http.dll","System.dll","Mono.Security.dll","System.Xml.dll","System.Numerics.dll","System.Core.dll","WebAssembly.Net.WebSockets.dll","netstandard.dll","System.Data.dll","System.Transactions.dll","System.Data.DataSetExtensions.dll","System.Drawing.Common.dll","System.IO.Compression.dll","System.IO.Compression.FileSystem.dll","System.ComponentModel.Composition.dll","System.Runtime.Serialization.dll","System.ServiceModel.Internals.dll","System.Xml.Linq.dll","WebAssembly.Bindings.dll","System.Memory.dll","WebAssembly.Net.Http.dll","aot-dummy.dll" ]);
	//require('mono.js');
 
	try { require('mono.js'); }
	catch(ex) 
	{
		if(ex.message === undefined) { throw ex; }
		console.log(JSON.stringify(ex.message)); 
	}
}