// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';

const getAllData = entity => {
    const ENTITY_URL = process.env.SWAPI_URL + entity;
    let arr = [];

    // first page
    return axios(ENTITY_URL)
        .then(response => {
            // collect from first page
            arr = response.data.results;
            return response.data.count;
        })
        .then(count => {
            // exclude the first request
            const numberOfPagesLeft = Math.ceil((count - 1) / 10);
            let promises = [];
            // start at 2 as you already queried the first page
            for (let i = 2; i <= numberOfPagesLeft; i++) {
                promises.push(axios(ENTITY_URL + `?page=${i}`));
            }
            return Promise.all(promises);
        })
        .then(response => {
            //get the rest records - pages 2 through n.
            arr = response.reduce((acc, data) => [...acc, ...data.data.results], arr);
            arr = arr.map((item) => {
                let id = null;
                let homeworldId = null;
                if (item.url) {
                    const url = item.url.split('/');
                    id = url[url.length-2];
                }

                if (item.homeworld) {
                    const homeworldUrl = item.homeworld.split('/');
                    homeworldId = homeworldUrl[homeworldUrl.length-2];
                }

                return {
                    ...item,
                    'id': id ? id:null,
                    'homeworld_id': homeworldId ? homeworldId:null
                }
            })

            return arr;
        })
        .catch(error => console.log("Properly handle your exception here"));
}

const getData = (entity, id) => {
    const ENTITY_URL = `${process.env.SWAPI_URL + entity}/${id}`;

    return axios(ENTITY_URL)
        .then(response => {
           return response.data;
        })
        .catch(error => console.log("Properly handle your exception here"));
}

export { getAllData, getData };
