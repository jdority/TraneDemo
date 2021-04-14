import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import communityBasePath from '@salesforce/community/basePath';
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
    @track selectedInvoices = [];

    connectedCallback() {
        APEX_getAllInvoices().then(results => {
            let tempInvoices = [...results];
            const domain = window.location.origin;
            const base = communityBasePath;
            const url = domain + base;

            tempInvoices.map(x => x.link = url + '/detail/' + x.Id)
            this.invoices = tempInvoices;
        });
    }

    handleRowUpdate(event) {
        const selectedRows = event.target.selectedRows;
        let rows = [];
        
        for (var i = 0; i < selectedRows.length; i++){
            let rowIndex = Number(selectedRows[i].replace(/\D/g, ''));
            rows.push(rowIndex);
        }

        let selected = this.invoices.filter((item, index) => rows.includes(index));
        this.selectedInvoices = selected;
    }

    payInvoices() {
        const baseURL = 'https://trane.com/';
        const params =  this.selectedInvoices.length > 0
                        ? this.setInvoiceNumbers(this.selectedInvoices)
                        : '';
        const url = baseURL + params;

        this[NavigationMixin.Navigate]({
            "type": "standard__webPage",
            "attributes": {
                "url": url
            }
        });
    }

    setInvoiceNumbers(invoices) {
        let retString = '?invoices=';
        const length = invoices.length;
        invoices.forEach(element => {
            element === invoices[length -1] 
            ? retString += element.Name
            : retString += (element.Name + ',');
        });
        return retString;
    }

}