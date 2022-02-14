import {Accordion, AccordionPanel, Box, CheckBox, DataTable, List, Text} from 'grommet';
import React, {Component} from "react";

const columns = [
    {
        property: 'location',
        header: 'Location',
        primary: true,
    },
    {
        property: 'name',
        header: 'Parameter',
    },

    {
        property: 'value',
        header: 'Value',
    }
];

const DATA = [
    {
        parameter: 'Alan',
        location: 'Hardware Vendor',
    },
    {
        parameter: 'Processor Type',
        location: 'Processor',
        value: 1234,
    },
    {
        parameter: 'Processor Count',
        location: 'Processor',
        value: 1,
    },
    {
        parameter: 'Adapter Type',
        location: 'Ethernet Adapters',
        value: 1345,
    },
    {
        parameter: 'Adapter Count',
        location: 'Ethernet Adapters',
        value: 4,
    },
    {
        parameter: 'Adapter Type',
        location: 'Ethernet Adapters',
        value: 2345,
    },
    {
        parameter: 'Adapter Count',
        location: 'Ethernet Adapters',
        value: 2,
    },
    {
        parameter: 'Type',
        location: 'Local Drives',
        value: 3456,
    },
    {
        parameter: 'Capacity',
        location: 'Local Drives',
        value: 3456,
    }
];

export default class CheckBoxTreeTable extends Component {

    constructor (props) {
        super(props);
    }

    // https://storybook.grommet.io/?path=/story/controls-tip-caret--caret
    render() {
        const { data } = this.props;
        console.log("CheckBoxTreeTable render: data: ", data);

        let machine_details = data['machineDetails']
        let network_adapters = data['networkDetails']
        let storage_details = data['storageDetails']

        let flat_json = [];

        function walk(obj, parent='') {
            console.log("!!!", obj);
            console.log("!!!parent: ", parent);
            console.log("!!!", typeof (obj));
            // if (typeof(obj) !== 'object'){
            //     console.log("$$$",obj)
            //     flat_json.push({"name": parent, "value": obj, "checked": true})
            //     return
            // }
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let val = obj[key];
                    let checked = obj['checked'];
                    console.log("@@@key: ",key);
                    console.log("@@@value: ",val);
                    console.log("@@@value type : ",typeof val);
                    console.log("@@@checked: ",checked);
                    if(typeof val === "object"){
                        if(key === 'value')
                            walk(val, parent);
                        else
                            walk(val, parent + "." + key);
                    }
                    else if (key === 'checked') {
                        flat_json.push({"name": parent, "value": "", "checked": val})
                    }
                    else{ // this is terminal value
                        if(key === 'value')
                            flat_json.push({"name": parent, "value": val, "checked": checked})
                        else
                            flat_json.push({"name": parent + "." + key, "value": val, "checked": checked})
                    }
                }
            }
        }
        walk(machine_details, "Machine Details");
        walk(network_adapters, "Network Adapters");
        walk(storage_details, "Storage");

        console.log("flat: ", flat_json);

        return (
            <Box direction="row" align="center">
                <DataTable
                    columns={columns}
                    data={flat_json}
                    border={false}
                    groupBy="location"
                    onSelect={() => {}}
                    sortable
                />
            </Box>
        );
    }
};

