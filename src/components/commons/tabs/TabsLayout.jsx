import {TabsItem} from "./TabsItem";

export const TabsLayout =  ({options,children}) => {

    const activeTab = options.find((option) => option.defecto);

    return(
       <>
           <ul className="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
               {
                   options.map((element,idx) => {
                      return (<TabsItem key={`${element.id}-${idx}`} {...element}/>)
                   })
               }
           </ul>
           <div className="tab-content" id="borderedTabJustifiedContent">
               <div className={`tab-pane fade show active`} id={`bordered-justified-${activeTab.id}`} role="tabpanel" aria-labelledby={`${activeTab.id}-tab`}>
                   {children}
               </div>
           </div>
       </>
   )
}