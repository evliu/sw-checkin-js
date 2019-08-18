import { randomBytes } from 'crypto';
import axios, { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

let headers: any = {};

const getHeaders = async () => {
	try {
		const { data }: AxiosResponse = await axios.get('https://mobile.southwest.com/js/config.js');
		const headers = {
			Host: 'mobile.southwest.com',
			'Content-Type': 'application/json',
			'X-API-Key': data.split('API_KEY:"')[1].split('"')[0],
			'X-User-Experience-Id': randomBytes(16)
				.toString('hex')
				.toUpperCase(),
			Accept: '*/*'
		};

		return Promise.resolve(headers);
	} catch (err) {
		console.error(err);
	}
};

const lookupReservation = async (conf: string, first: string, last: string) => {
	try {
		headers = await getHeaders();
		const { data }: AxiosResponse = await axios.get(
			`https://mobile.southwest.com/api/mobile-air-booking/v1/mobile-air-booking/page/view-reservation/${conf}?first-name=${first}&last-name=${last}`,
			{ headers }
		);

		return Promise.resolve(data);
	} catch (err) {
		console.error(err);
	}
};

const getCheckinTime = async (conf: string, first: string, last: string): Promise<Moment> => {
	const { viewReservationViewPage: reservation } = await lookupReservation(conf, first, last);
	const { bounds } = reservation;
	const { departureDate, departureTime } = bounds[0];
	const checkinTime = moment(`${departureDate} ${departureTime}`).subtract(24, 'h');
	return Promise.resolve(checkinTime);
};

const checkin = async (conf: string, first: string, last: string, email: string) => {
	try {
		headers = await getHeaders();
		const response: AxiosResponse = await axios.get(
			`https://mobile.southwest.com/api/mobile-air-operations/v1/mobile-air-operations/page/check-in/${conf}?first-name=${first}&last-name=${last}`,
			{ headers }
		);

		const info: { href: any; body: any } = response.data.checkInViewReservationPage._links.checkIn;
		const checkinUrl = `https://mobile.southwest.com/api/mobile-air-operations${info.href}`;

		console.log(`🎫  Checking in ${conf} for ${first} ${last}`);

		const confirmation = await axios.post(checkinUrl, info.body, { headers });

		console.log(`🛩  Confirmation info for ${conf} ${first} ${last}`);

		const {
			href: boardingPassUrl,
			body: boardingPassBody
		} = confirmation.data.checkInConfirmationPage._links.boardingPasses;

		const { data: boardingPassesResponse } = await axios.post(
			`https://mobile.southwest.com/api/mobile-air-operations${boardingPassUrl}`,
			boardingPassBody,
			{ headers }
		);

		if (!!email) {
			const {
				href: sendBoardingPassUrl,
				body: sendBoardingPassBody
			} = boardingPassesResponse.checkInViewBoardingPassPage._links;

			console.log(`📨  Attempting to email boarding pass to ${email}`);

			const sendBoardingPassesResponse = await axios.post(
				`https://mobile.southwest.com/api/mobile-air-operations${sendBoardingPassUrl}`,
				{ ...sendBoardingPassBody, mediaType: 'EMAIL', emailAddress: email },
				{ headers }
			);
		}

		console.log('🏁  Done!');
	} catch (err) {
		console.error(err.response);
		console.log('😑  Failed...')
	}
};

const run = async (args: any) => {
	const conf = args[2];
	const first = args[3];
	const last = args[4];
	const email = args[5];

	const checkinTime = await getCheckinTime(conf, first, last);
	console.log(`🛫  Will checkin ${conf} for ${first} ${last} ${checkinTime.fromNow()}`);
	setTimeout(() => checkin(conf, first, last, email), checkinTime.diff(moment()));
};

run(process.argv);
