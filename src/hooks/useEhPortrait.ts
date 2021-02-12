import React from 'react';

export default function useEhPortrait()
{
    const func = () => typeof window !== "undefined" ? window.innerWidth < window.innerHeight : false;

    const [bln, setBln] = React.useState(func());

    React.useEffect(() => {
        if(typeof window !== "undefined")
        {
            const onResize = (evt: any) => {
                setBln(func)
            };

            window.addEventListener("resize", onResize);
            return () => { window.removeEventListener("resize", onResize); }
        }
    });
    
    return bln;
}