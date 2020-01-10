# screeps-wasm-poc
WIP

## Build environment
* Windows 10 with ubuntu 18.04 subsystem
* [emsdk lastest-upstream ](https://emscripten.org/docs/getting_started/downloads.html) (1.39.5 as of writing)
* [mono preview 6.8](https://www.mono-project.com/download/preview/) (6.8.0.91 as of writing)
* [mono wasm sdk](https://github.com/mono/mono/blob/master/sdks/wasm/docs/getting-started/obtain-wasm-sdk.md)
    * Should end up with two files 'wasm/mono-wasm-...zip' & 'wasm-release-Linux-...zip' both of them will need to be extracted into the same directory
	* I used the build on the 5th/jan/2020 to set up this poc

Currently the build process is failing with a 'subcommand failed' due to an assert within the emsdk that's been added recently. A workaround is to comment out the following line in emsdk\upstream\emscripten\emcc.py (ln 1018 on my machine):

>assert has_source_inputs or has_header_inputs, 'Must have source code or header inputs to use -c or -S'

Will this do terrible things? Almost certianly! But do it, do it for science.

## Building
From the emsdk directory

>./emsdk activate latest-upstream 

>./source ./emsdk_env.sh

Set WASM_SDK to the directory to the mono wasm sdk directory eg.
>export WASM_SDK=/mnt/c/dev/sdk/mono-wasm

Finally all thats left is to run the provided
> ./build.sh


## Deploying
TODO: Steps to modify the server to accept larger codebases

In the bin/aot-bindings-sample directory:
* Delete 'var Module = typeof Module !== 'undefined' ? Module : {};' from mono.js 
    *  Something specific js environment
* change 'var MONO=' to 'global.MONO=' in mono.js 
    *  got lazy, need access to this from another module
* Raname 'mono.js' to 'mono.js.js'.
    *  Can't load two files of the same name/different extension in screeps.
* Rename 'mono.wasm' to 'mono.wasm.wasm'. 'same logic as mono.js.js'.
* Raname all the dlls in the 'managed to .dll.wasm. 
    * The screeps server doesn't like '.dll' but treats all wasm files like binaries anyway.

Finally copy 'main.js', 'mono-loader.js', 'mono-overrides.js' from the root directory, 'mono.js.js', 'mono.wasm.wasm' & the .dll.wasm files into the same directory on the screeps server.

## Running
The environment should load automatically.
One can call the 'Add' method already in the sample.cs like so:
> var add = Module.mono_bind_static_method("[sample] PoC.Program:Add"); console.log(add(1, 2));

TODO: get up the more complex calling back/forth once I have tested it with this build environment.

## Acknowledgements
Thankyou Balint Pogatsa for putting [this](https://balintpogatsa.github.io/2019/05/05/webassembly-mono-aot-example.html) guide together.
