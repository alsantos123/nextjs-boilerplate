import { useEffect } from 'react';

const useScript = (url: string, fnOnLoadCallback?: () => void) => 
{
	useEffect(() => 
	{
		const script = document.createElement('script');

		if(fnOnLoadCallback)
		{
			script.onload = fnOnLoadCallback;
		}
		script.src = url;
		script.async = true;

		document.body.appendChild(script);

		return () => 
		{
			document.body.removeChild(script);
		}
	}, [url]);
};

export default useScript;