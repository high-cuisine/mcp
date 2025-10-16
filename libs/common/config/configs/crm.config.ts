import env from '../config.validator';

export default () => ({
	apiKey: env.get('CRM_API_KEY').required().asString(),
});
