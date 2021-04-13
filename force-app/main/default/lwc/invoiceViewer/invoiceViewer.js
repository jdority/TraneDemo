import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import communityBasePath from '@salesforce/community/basePath';
import communityId from '@salesforce/community/Id';
import APEX_getAllInvoices from '@salesforce/apex/InvoiceViewerController.getAllInvoices'; // no params

const cols = [
    {
        label: "Invoice Number",
        fieldName: "link",
        type: "url",
        typeAttributes: { label: { fieldName: 'Name' }, target: '/' }
    },
    {
        type: "date",
        fieldName: "Invoice_Date__c",
        label: "Invoice Data"
    },
    {
        type: "text",
        fieldName: "Status__c",
        label: "Status"
    },
    {
        type: 'currency',
        typeAttributes: { currencyCode: 'USD', step: '0.001' },
        fieldName: "Amount__c",
        label: "Total Amount",
        sortable: true
    },
    {
        type: 'currency',
        typeAttributes: { currencyCode: 'USD', step: '0.001' },
        fieldName: "Total_Payment__c",
        label: "Total Payment",
        sortable: true
    },
    {
        type: 'currency',
        typeAttributes: { currencyCode: 'USD', step: '0.001' },
        fieldName: "Balance_Due__c",
        label: "Balance Due",
        sortable: true
    },
];

export default class InvoiceViewer extends NavigationMixin(LightningElement) {
    @track columns = cols;
    @api invoices;

    connectedCallback() {
        // this.isLoading();

        APEX_getAllInvoices().then(results => {
            let tempInvoices = [...results];
            const domain = window.location.origin;
            const base = communityBasePath;
            const url = domain + base;
            console.log(url);

            tempInvoices.map(x => x.link = url + '/detail/' + x.Id)
            this.invoices = tempInvoices;
            console.log(this.invoices);

            // this.sfdcBaseURL = window.location.origin;
            //   this.isLoaded();
        });
    }

    payInvoices() {
        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": "https://trane.com"
            }
        });
    }
}