// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/// <reference path="../../definitions/node.d.ts"/>

import ifm = require('../interfaces');

export class BearerCredentialHandler implements ifm.IRequestHandler {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options:any): void {
        options.headers['Authorization'] = 'Bearer ' + this.token;
        options.headers['X-TFS-FedAuthRedirect'] = 'Suppress';
    }
}
