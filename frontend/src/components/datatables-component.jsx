/**
 * DataTables Component
 *
 * @description Contains the DataTables component.
 * Note that DataTables is a separate plugin not amenable to usual React paradigm.
 * You might need to get familiarize with its API - https://datatables.net/manual/
 * @author Gacel Perfinian
 * @date 04/26/2024
 */

import '../assets/css/datatables.min.css';
import React, { useEffect } from 'react';

const DataTablesComponent = ({id, columns, data }) => {

    useEffect(() => {
        const loadDataTable = () => {
            const $ = window.$
            if ( $.fn.dataTable.isDataTable('#' + id) ) {
                $('#' + id).DataTable({retrieve:true}).destroy();
            }
            $('#' + id).DataTable({
                columns: columns,
                data: data,
                order: [],
                responsive: true,
                stateSave: true
            }).on("length.dt order.dt page.dt search.dt", () => {
                // Recalc - prevent display bugs
                $('#' + id).DataTable({retrieve:true}).columns.adjust().responsive.recalc();
                // Remove unexpected colspan due to DataTable Bug
                document.querySelectorAll("table.dataTable td[colspan]:not(.dataTables_empty)").forEach((x) => x.removeAttribute("colspan"));
            });
        }
        window.DataTableLoaded ? loadDataTable() : document.addEventListener('DataTableLoaded',loadDataTable);

        return () => {
            window.$('#' + id).DataTable({retrieve:true}).state.clear()
        }
    // eslint-disable-next-line
    }, [data]);

    return (
        <table id={id} style={{width:'100%'}}></table>);
}

export default DataTablesComponent;