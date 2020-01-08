# screeps-wasm-poc

##Build environment
Windows 10 with ubuntu 18.04 subsystem
[emsdk lastest-upstream ](https://emscripten.org/docs/getting_started/downloads.html) 
	..* (1.39.5 as of writing)

[mono preview 6.8](https://www.mono-project.com/download/preview/)
	..* 6.8.0.91 as of writing

[mono wasm sdk](https://github.com/mono/mono/blob/master/sdks/wasm/docs/getting-started/obtain-wasm-sdk.md)
	..* both of them will need to be extracted into the same directory
	..* I used the latest build on the 5th/jan/2020

Currently the build process is failing with a 'subcommand failed' due to an assert within the emsdk that's been added recently. 
A workaround is to comment out the following line in emsdk\upstream\emscripten\emcc.py (ln 1018 on my machine)
>assert has_source_inputs or has_header_inputs, 'Must have source code or header inputs to use -c or -S'

Will this do terrible things? Almost certianly! But do it, do it for science.

##Building
From the emsdk directory
>./emsdk activate latest-upstream 
>./source ./emsdk_env.sh

Set WASM_SDK to the directory to the mono wasm sdk directory
>export WASM_SDK=/path

run ./build.sh

##acknowledgements
Balint Pogatsa for putting [this](https://balintpogatsa.github.io/2019/05/05/webassembly-mono-aot-example.html) guide together.