import { useEffect, useRef, useState } from 'react';
import ReactDom from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
	const ref = useRef<any>();
	const [input, setInput] = useState('');
	const [code, setCode] = useState('');

	const startService = async () => {
		ref.current = await esbuild.startService({
			worker: true,
			wasmURL: '/esbuild.wasm',
		});
	};

	useEffect(() => {
		startService();
	}, []);

	const onClick = async () => {
		if (!ref.current) {
			return;
		}

		const result = await ref.current.build({
			entryPoints: ['index.js'],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(input)],
			define: {
				'process.env.NODE_ENV': '"production"',
				global: 'window',
			},
		});
		// console.log('result =>', result);

		setCode(result.outputFiles[0].text);
	};
	return (
		<>
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}></textarea>
			<div>
				<button onClick={onClick}>Valider</button>
			</div>
			<pre>{code}</pre>
		</>
	);
};

ReactDom.render(<App />, document.querySelector('#root'));
