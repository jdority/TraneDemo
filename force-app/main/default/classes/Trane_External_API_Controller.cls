public with sharing class Trane_External_API_Controller {
	@AuraEnabled(cacheable=false)
	public static Map<String, Object> fetchData(Integer pageSize, Integer lastRow) {
		Map<String, Object> dataMap = new Map<String, Object>();

		HttpRequest req = new HttpRequest();
		req.setEndpoint('https://mq110ax626.execute-api.us-east-1.amazonaws.com/Development/RPASC/catalog/1234/unitPartList/TWE060A100EL');
		req.setMethod('GET');

		// Create a new http object to send the request object
		// A response object is generated as a result of the request
		Http http = new Http();
		HTTPResponse res = http.send(req);

		String data = res.getBody();
		Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(data);

		List<Object> SubAssemblies = (List<Object>) responseMap.get('SubAssemblies');
		Integer totalRecords = SubAssemblies.size();

		if (lastRow == 0) {
			if (totalRecords < pageSize) {
				dataMap.put('subAssemblies', SubAssemblies);
				dataMap.put('lastRow', totalRecords);
			} else {
				List<Object> temp = new List<Object>();

				for (Integer i = 0; i < pageSize; i++) {
					temp.add(SubAssemblies.get(i));
				}
				dataMap.put('subAssemblies', temp);
				dataMap.put('lastRow', temp.size());
			}
		} else {
			List<Object> temp = new List<Object>();

			if (lastRow + pageSize <= totalRecords) {
				for (Integer i = lastRow; i < pageSize + lastRow; i++) {
					temp.add(SubAssemblies.get(i));
				}

				dataMap.put('subAssemblies', temp);
				dataMap.put('lastRow', lastRow + temp.size());
			} else {
				for (Integer i = lastRow; i < totalRecords; i++) {
					temp.add(SubAssemblies.get(i));
				}

				dataMap.put('subAssemblies', temp);
				dataMap.put('lastRow', lastRow + temp.size());
			}
		}

		dataMap.put('totalRecords', totalRecords);

		return dataMap;
	}
}