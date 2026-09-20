'use client';
import {createContext,useContext} from 'react';
export type BagItem={id:string;name:string;price:number;quantity:number;configuration?:{items:string[];capacity:number;occasion:string;to:string;from:string;message:string;ribbon:boolean;card:boolean}};
type Store={bag:BagItem[];wishlist:string[];add:(item:Omit<BagItem,'quantity'>,origin?:HTMLElement,amount?:number)=>void;quantity:(id:string,n:number)=>void;toggleWish:(id:string)=>void;openBag:()=>void;ready:boolean};
export const StoreContext=createContext<Store|null>(null);export const useStore=()=>{const s=useContext(StoreContext);if(!s)throw new Error('Missing store');return s};
