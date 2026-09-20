import {createClient} from '@supabase/supabase-js';
export function storeService(){const url=process.env.SUPABASE_URL;const key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)return null;return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
export function isPreview(){return process.env.VANORIA_STORE_MODE!=='test';}
export const unavailable=()=>Response.json({error:'This service is not connected in the team preview. Please check back when the store launches.'},{status:503});
export function trustedOrigin(request:Request){const origin=request.headers.get('origin');return !!origin&&origin===new URL(request.url).origin;}
