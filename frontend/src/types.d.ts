
//--- Module Types ---\\

declare module "config.json" {
	const config: {
		ccp_init: {
			ccpUrl: string;
			loginUrl: string;
			region: string;
		};

		customer_profile_url: string;

		api: {
			metrics: string;
			set_disposition: string;
			get_frames: string;
			zendesk_ticket: string;
		};
		Zendesk_metadata: {
			get_user_api_url: string,
			api_token: string,
			username: string
		},
		version: string;
	};
	export default config;
}

//--- Utility Types ---\\

// Extracts the type of the arguments of F.
type ArgType<F extends (...any: any[]) => any> = F extends (...args: infer U) => any ? U : never;
