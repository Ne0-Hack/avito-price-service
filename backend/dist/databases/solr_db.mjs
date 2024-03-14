import * as solr from "solr-client";
const host = process.env.SOLR_HOST;
const port = process.env.SOLR_PORT;
const core = process.env.SOLR_CORE_USER;
export const solrUsersClient = solr.createClient({
    host: host, port: port, core: core
});
