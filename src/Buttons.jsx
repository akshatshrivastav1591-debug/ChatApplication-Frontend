export function Buttons({children,OnChange}){
    return(<>
    
    <button onClick={OnChange} className="bg-blue-300 ml-2 p-1 px-3 font-mono rounded-xl hover:bg-blue-400 ">{children}</button>
    
    </>)
}