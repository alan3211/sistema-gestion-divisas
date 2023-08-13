import {TabsItem} from "./TabsItem";

export const TabsLayout =  ({options,children}) => {
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
               {
                   options.map((element,idx) => {
                       return(
                           <div className="tab-pane fade show" id="bordered-justified-home" role="tabpanel"
                            aria-labelledby={`${element.id}-tab`} key={`${element.id}-${idx}`}>
                               {children}
                            </div>
                       )
                   })
               }
           </div>
       </>
   )
}