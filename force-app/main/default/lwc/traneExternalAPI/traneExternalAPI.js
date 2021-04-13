import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

// CONTROLLER METHODS
import fetchData from "@salesforce/apex/Trane_External_API_Controller.fetchData";

//DATATABLE COLUMNS
const columns = [
	{ label: "Product Image", fieldName: "ImagePath", type: "image" },
	{ label: "Component Number", fieldName: "ComponentNumber", type: "text" },
	{ label: "Description", fieldName: "Description", type: "text" },
	{ label: "PartsListNumber", fieldName: "PartsListNumber", type: "text" }
];

export default class TraneExternalAPI extends LightningElement {
	@api pageSize;

	columns = columns;

	tableElement;
	@track enableInfiniteLoadingStatus = true;
	@track dataRow;
	@track totalRecords;
	@track lastRow = 0;
	@track hasRows = false;

	connectedCallback() {
		console.log("traneExternalAPI: connectedCallback()");

		this.showLoadingSpinner = true;

		fetchData({
			pageSize: this.pageSize,
			lastRow: this.lastRow
		})
			.then((data) => {
				console.log("traneExternalAPI: connectedCallback(): fetchData() success!");
				console.log(data);

				this.showLoadingSpinner = false;

				this.dataRow = data.subAssemblies;

				this.lastRow = data.lastRow;
				console.log("traneExternalAPI: connectedCallback(): fetchData(): this.lastRow", this.lastRow);

				this.totalRecords = data.totalRecords;
				console.log("traneExternalAPI: connectedCallback(): fetchData(): this.totalRecords", this.totalRecords);

				if (this.dataRow.length >= this.totalRecords) {
					this.enableInfiniteLoadingStatus = false;
					this.loadMoreStatus = "No more data to load";
				}

				this.hasRows = true;
			})
			.catch((error) => {
				this.processError(error);
			});
	}

	loadMoreData(event) {
		console.log("traneExternalAPI: loadMoreData()");
		console.log("traneExternalAPI: loadMoreData(): this.lastRow", this.lastRow);

		if (event.target) {
			event.target.isLoading = true;
		}
		this.tableElement = event.target;
		//Display "Loading..." when more data is being loaded
		this.loadMoreStatus = "Loading...";

		fetchData({
			pageSize: this.pageSize,
			lastRow: this.lastRow
		})
			.then((data) => {
				console.log("traneExternalAPI: loadMoreData(): fetchData() success!");
				console.log(data);

				const currentData = this.dataRow;
				//Appends new data to the end of the table
				this.dataRow = currentData.concat(data.subAssemblies);

				this.lastRow = data.lastRow;
				console.log("traneExternalAPI: loadMoreData(): fetchData(): this.lastRow", this.lastRow);

				this.loadMoreStatus = "";

				if (this.dataRow.length >= this.totalRecords) {
					this.enableInfiniteLoadingStatus = false;
					// this.tableElement.enableInfiniteLoading = false;
					this.loadMoreStatus = "No more data to load";
				}

				if (this.tableElement) {
					this.tableElement.isLoading = false;
				}
			})
			.catch((error) => {
				this.loadMoreStatus = "";
				this.processError(error);
			});
	}

	processError(error) {
		console.log("traneExternalAPI(): processError");
		console.log("traneExternalAPI():", error);

		this.showLoadingSpinner = false;

		let message = error.body ? error.body.message : error;

		this.dispatchEvent(
			new ShowToastEvent({
				title: "ERROR",
				message: message,
				variant: "error"
			})
		);
	}
}