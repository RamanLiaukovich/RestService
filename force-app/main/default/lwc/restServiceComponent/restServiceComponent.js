import { LightningElement, track } from 'lwc';
import { methods, labels, standardHeaders } from 'c/utilModul';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const METHODS = [
    { label: methods.GET, value: methods.GET },
    { label: methods.POST, value: methods.POST },
    { label: methods.PUT, value: methods.PUT },
    { label: methods.PATCH, value: methods.PATCH },
    { label: methods.DELETE, value: methods.DELETE }
];

const BODY_TYPE_OPTIONS = [
    { label: labels.formData, value: 'body-form-data' },
    { label: labels.raw, value: 'body-raw' },
    { label: labels.binary, value: 'body-binary' }
];

export default class RESTUtilComponent extends LightningElement {
    @track headersData = standardHeaders;
    @track bodyData = [{ key: '', value: '', checked: true }];
    @track jsonResponse;

    methodOptions = METHODS;
    bodyTypeOptions = BODY_TYPE_OPTIONS;
    selectedMethod = this.methodOptions[0].value;
    chosenBodyType = this.bodyTypeOptions[0].value;
    isGetResponse = false;
    isDataLoading = false;
    isSuccessResponse = true;
    requestBody;
    labels = labels;
    response;
    textResponse;
    files = [];

    onMethodChange(event) {
        this.selectedMethod = event.detail.value;
    }

    addHeaderAction() {
        this.headersData.push({
            key: '',
            value: '',
            checked: true
        });
    }

    checkboxChange(event) {
        this.headersData[event.target.name].checked = event.target.checked;
    }

    changeKey(event) {
        this.headersData[event.target.name].key = event.target.value;
    }

    changeValue(event) {
        this.headersData[event.target.name].value = event.target.value;
    }

    changeBodyKey(event) {
        this.bodyData[event.target.name].key = event.target.value;
    }

    changeBodyValue(event) {
        this.bodyData[event.target.name].value = event.target.value;
    }

    bodyCheckboxChange(event) {
        this.bodyData[event.target.name].checked = event.target.checked;
    }

    addBodyPairAction() {
        this.bodyData.push({
            key: '',
            value: '',
            checked: true
        });
    }

    bodyTypeChange(event) {
        this.chosenBodyType = event.target.value;
        this.template.querySelectorAll('.request-body').forEach((item) => {
            item.classList.add('hidden');
        });
        this.template.querySelector('.' + this.chosenBodyType).classList.remove('hidden');
    }

    bodyChange(event) {
        this.requestBody = event.target.value;
    }
    
    handleUploadFinished(event) {
        this.files = event.detail.files;
    }

    async sendRequest() {
        this.textResponse = labels.checkRequestUrl;
        this.isSuccessResponse = true;
        this.isDataLoading = true;

        const headers = {};
        const formDataBody = {}
        const url = this.template.querySelector('[data-id="url-input"]').value;
        const filteredHeaders = this.headersData.filter(item => item.checked === true && item.key && item.value).forEach((item) => headers[item.key] = item.value);
        const filteredBody = this.bodyData.filter(item => item.checked === true && item.key && item.value).forEach((item) => formDataBody[item.key] = item.value);
        const bodyType = this.chosenBodyType;
        const body = this.selectedMethod === 'GET' 
                        ? null 
                        : bodyType === 'body-raw' 
                            ? this.template.querySelector('.' + bodyType).value
                            : this.getFormData();
        
        try {
            const response = await fetch(url, {
                method: this.selectedMethod,
                mode: 'cors',
                headers,
                body
            });

            this.response = response;

            if (!response.ok) {
                this.isSuccessResponse = false;
                this.showToast(
                    this.labels.requestError, 
                    labels.notOkResponse + ' ' + labels.status + ': ' + response.status, 
                    this.labels.error
                );
            }
           
            const textResponse = response.clone();
            this.jsonResponse = await response.json();
            this.textResponse = await textResponse.text();
            this.response.headerArr = [];

            for (let pair of response.headers.entries()) {
                this.response.headerArr.push({
                    key: pair[0],
                    value: pair[1]
                })
            }
            this.isGetResponse = true;
            this.isDataLoading = false;
        } catch (error) {
            this.showToast(this.labels.requestError, error.message, this.labels.error);
            this.isDataLoading = false;
            this.isGetResponse = true;
        }
    }

    getFormData() {
        const formData = new FormData();

        if (this.chosenBodyType === 'body-form-data') {
            const keys = [];
            const values = [];
            
            this.template.querySelectorAll('[data-id="form-key"]').forEach((item, index) => keys[index] = item.value);
            this.template.querySelectorAll('[data-id="form-value"]').forEach((item, index) => values[index] = item.value);
            
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] && values[i]) {
                    formData.append(keys[i], values[i]);
                }
            }
        } else if (this.chosenBodyType === 'body-binary' && this.files.length > 0) {

            for (let i = 0; i < this.files.length; i++) {
                formData.append('file', this.files[i]);
            }
        }
        
        return formData;
    }


    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(evt);
    }

    
}