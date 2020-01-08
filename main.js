console.log(`Loading bot code at tick: (${Game.time})...`); 

const monoLoader = require('mono-loader');
//require('fs'); //XXXX: must be first

//
 
 
module.exports.loop = function () {
	//return;
	let wasmFilename = 'mono.wasm';
	if(!global.Module) { monoLoader(); }
	if(!global.wasmBinary)
	{
		console.log('Loading binary');
		global.wasmBinary = require(wasmFilename);
		return;
	}
	
	if(!global.wasmModule)
	{
		console.log('Creating wasm module');
		global.wasmModule = new WebAssembly.Module(global.wasmBinary);
		return;
	}
	
	if(!global.asm)
	{
		console.log('Instancing mono assembly');
		global.asm = new WebAssembly.Instance(global.wasmModule, Module['info']);
		delete Module['info'];
		return;
	}
	
	if(!global.callBackCalled)
	{
		console.log('Calling ze callback');
		global.callBackCalled = true;
		Module['rcvi'](global.asm);
		delete Module['rcvi'];
		console.log('done');
		return;
	}
	
	if(!Game.spawns['Spawn1']) { return; }
	let s = Game.spawns['Spawn1'];//Game.rooms['W2N5'].find(FIND_MY_SPAWNS)[0];
	let d = Game.creeps['d'];
	if(!d) 
	{
		s.createCreep([MOVE, CARRY, WORK], 'd'); return; 
	}
	 
	if(d.carry['energy'] == 0)
	{
		d.moveTo(s);
		d.withdraw(s, 'energy');
		return;
	}
	 
	d.moveTo(d.room.controller);
	d.upgradeController(d.room.controller);
	
	
	
	//var wasm = global.wasm;
	//if(!wasm)
	//{
	//	global.wasm = {};
	//	return; 
	//}
	//
	//var binary = wasm.binary;
	//if(!binary)
	//{
	//	console.log('Reading file...');
	//	wasm.binary = require('HelloWasm.wasm');
	//	return;
	//}
	
//	var module = wasm.module;
//	if(!module)
//	{
//		console.log('Creating module...');
//		wasm.module = new WebAssembly.Module(binary);
//		return;
//	}
//	
//	var hw = wasm.hw;
//	if(hw) { return; }
//	
//	if(Game.cpu.bucket < 1000) 
//	{ 
//		console.log("Not enough cpu to load binaries. Waiting for bucket to fill...");
//		return;
//	}
//	
//	wasm.hw = require('HelloWasm.js');
};