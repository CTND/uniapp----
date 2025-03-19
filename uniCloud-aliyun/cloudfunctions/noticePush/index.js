'use strict';
const uniPush = uniCloud.getPushManager({
	appId: "__UNI__B9D8DDC"
})
exports.main = async (event) => {
	let obj = JSON.parse(event.body)
	const res = await uniPush.sendMessage({
		"push_clientid": obj.cids,
		"title": obj.title,
		"content": obj.content,
		"payload": obj.data,
		"force_notification": true,
		"request_id": obj.request_id,
		"options":obj.options,
	})
	return res;
};
