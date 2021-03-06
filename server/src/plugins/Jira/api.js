'use strict'

const fetch = require('node-fetch');
const pgResponses = require('../../services/pg-responses');

var arrayMethods = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE'
}

function makeFetch(uri, method, body, AToken) {
    let headers = {
        'Accept': 'application/json'
    }
    if (AToken) {
        headers.Authorization = `Basic ${Buffer.from(
            `${AToken}`
        ).toString('base64')}`
    }

    return fetch(uri, {
        method: method,
        headers,
        body: body
    })
        .then(response => {
            if (response.status !== pgResponses.OK) return Promise.reject(response);
            return response.json()
        })
}

function apiJira() {
    const jira = {
        validateProject: function (PURL, Pid, ownerCredentials) {
            let project = {}
            return makeFetch(`${PURL}/rest/api/3/project/${Pid}`, arrayMethods.GET, null, ownerCredentials.AToken)
                .then(body => {
                    const avt = body.avatarUrls[Object.keys(body.avatarUrls)[0]];
                    project = {
                        "id": body.id,
                        "owner_name": "",
                        "description": body.description,
                        "avatar": avt.toString(),
                        "type": "Jira",
                        "title": body.name,
                        "URL": PURL,
                        "ownerCredentials": ownerCredentials,
                        "memberCredentials": []
                    }
                    return this.getUserById(PURL, body.lead.accountId, ownerCredentials.AToken)
                })
                .then(id => project.owner_name = id)
                .then(() => project)
                .catch(error => pgResponses.resolveErrorApis(error));
        },

        getUserById: function (PURL, UId, AToken) {
            return makeFetch(`${PURL}/rest/api/3/user?accountId=${UId}`, arrayMethods.GET, null, AToken)
                .then(body => body.emailAddress)
                .catch(error => pgResponses.resolveErrorApis(error));
        },

        getProjectsFromUsername: function (PURL, username, AToken) {
            return makeFetch(`${PURL}/rest/api/3/project`, arrayMethods.GET, null, AToken)
                .then(body => body.map(project => {
                    return {
                        "id": project.id,
                        "title": project.name
                    }
                }))
                .catch(error => pgResponses.resolveErrorApis(error));
        },

        getIssues: function (PURL, Pid, AToken) {
            return makeFetch(`${PURL}/rest/api/2/search?jql=project=${Pid}`, arrayMethods.GET, null, AToken)
                .then(body => {
                    let arrayIssues = []
                    body.issues.forEach(issue => arrayIssues.push({
                        "id": issue.id,
                        "title": issue.fields.summary,
                        "assigneeId": issue.fields.assignee.accountId,
                        "state": issue.fields.status,
                        "created_at": issue.fields.created,
                        "closed_at": issue.fields.resolutiondate,
                        "due_date": issue.fields.duedate
                    }))
                    return arrayIssues
                })
                .catch(error => pgResponses.resolveErrorApis(error));
        }
    }
    return jira;
}

module.exports = apiJira;
