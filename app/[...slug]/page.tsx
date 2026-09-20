import {RoutePage} from '@/components/vanoria/routes';
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const{slug}=await params;return <RoutePage path={slug.join('/')}/>}
