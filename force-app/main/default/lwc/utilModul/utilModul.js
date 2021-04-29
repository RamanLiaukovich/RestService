const methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
};

const labels = {
    requestHeaders: 'Request Headers',
    requestBody: 'Request Body',
    key: 'Key',
    value: 'Value',
    removeHeader: 'You can remove this header or enter different value.',
    hitSend: 'Hit Send to get a response',
    response: 'Response',
    body: 'Body',
    headers: 'Headers',
    pretty: 'Pretty',
    raw: 'Raw',
    status: 'Status',
    error: 'error',
    requestError: 'Request Error',
    notOkResponse: `Response status isn't OK`,
    formData: 'FormData',
    binary: 'Binary',
    rawInputLabel: 'Type a request body, as a JSON without start and end bracket',
    checkRequestUrl: 'Check your request url or headers.'
};

const standardHeaders = [
    {
        key: 'Accept',
        value: 'application/json',
        checked: true,
        helpText: `The "Accept" header advertises which content types, expressed as MIME types, the client is able to understand.`
    },
    {
        key: 'Content-Type',
        value: 'application/json; charset=UTF-8',
        checked: false,
        helpText: `The "Content-Type" entity header is used to indicate the media type of the resource.`
    },
];

export default { methods, labels, standardHeaders };