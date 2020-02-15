import WebFetcher, { HTTPResponse, HTTPResponseType } from '../src/util/webFetcher';

const TEST_URL = 'https://webscraper.io/test-sites/tables';

describe('WebFetcher', () =>
{
	test('should fetch example page', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'UTF-8')).resolves.toEqual(
			expect.objectContaining({
				details: expect.stringContaining('Table playground'),
			}),
		);
	});

	test('should fail on 404', async () =>
	{
		await expect(new WebFetcher().request('https://httpstat.us/404', 'UTF-8')).rejects.toBe(
			new HTTPResponse(HTTPResponseType.NO_RESPONSE),
		);
	});

	test('should throw error on invalid encoding argument', async () =>
	{
		await expect(new WebFetcher().request(TEST_URL, 'Lorem ipsum')).rejects.toEqual(
			new HTTPResponse(HTTPResponseType.FAILED, 'WebFetcher Error: "Lorem ipsum" encoding don\'t exist'),
		);
	});
});
