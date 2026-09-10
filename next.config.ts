import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard",
				permanent: true, // o false si es temporal
			},
		];
	},
};

export default nextConfig;
