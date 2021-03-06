// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/// <reference path="../definitions/Q.d.ts" />

import ifm = require('./interfaces');
import httpm = require('./httpclient');
import restm = require('./restclient');
import Q = require("q");

export class BuildApi implements ifm.IBuildApi {
    collectionUrl: string;
    httpClient: httpm.HttpClient;
    restClient: restm.RestClient;

    constructor(collectionUrl: string, handlers: ifm.IRequestHandler[]) {
        this.collectionUrl = collectionUrl;
        this.httpClient = new httpm.HttpClient('vso-build-api', handlers);
        this.restClient = new restm.RestClient(collectionUrl, this.httpClient);
    }

    //
    // TODO: do options request to avoid path math
    //       or replace this with the auto-generated typescript client
    //

    public postArtifact(projectId: string, buildId: number, artifact: ifm.BuildArtifact, onResult: (err: any, statusCode: number, artifact: ifm.BuildArtifact) => void): void {
        this.restClient.create(projectId + "/_apis/build/builds/" + buildId + "/artifacts", artifact, onResult);
    }
}

export class QBuildApi {
    _buildApi: ifm.IBuildApi;

    constructor(collectionUrl:string, handlers: ifm.IRequestHandler[]) {
        this._buildApi = new BuildApi(collectionUrl, handlers);
    }

    public postArtifact(projectId: string, buildId: number, artifact: ifm.BuildArtifact): Q.Promise<ifm.BuildArtifact> {
        var deferred = Q.defer<ifm.BuildArtifact>();

        this._buildApi.postArtifact(projectId, buildId, artifact, (err: any, statusCode: number, artifact: ifm.BuildArtifact) => {
            if (err) {
                err.statusCode = statusCode;
                deferred.reject(err);
            }
            else {
                deferred.resolve(artifact);
            }
        });

        return deferred.promise;
    }
}
