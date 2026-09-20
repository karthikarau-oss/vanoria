import {trustedOrigin} from '@/lib/server/supabase';
// Deliberately fail closed until final catalogue, tax, delivery and payment settings are approved.
export async function POST(request:Request){if(!trustedOrigin(request))return Response.json({error:'Invalid origin'},{status:403});return Response.json({error:'Checkout is not enabled for sample products. No payment has been taken.'},{status:503});}
