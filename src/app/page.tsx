import LandingPage from "@/app/components/LandingPage";
import { createClient } from "@/lib/supabase/client";
import DashboardOverviewPage from "./(dashboard)/dashboard/page";
export default async function HomePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	console.log(user);
	if (!user) {
		return <LandingPage />;
	}

	return <LandingPage />;
}
