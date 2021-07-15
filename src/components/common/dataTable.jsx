import React from 'react';
import MaterialTable from 'material-table'

const DataTable = ({title, columns, data, handleDelete='', handleSeeMore=''}) => {
    return (
        <MaterialTable
            columns={columns}
            data={data}
            actions={[
                {
                    icon: 'insights',
                    tooltip: 'Technical Insights',
                    onClick: (event, rowData) => handleSeeMore(rowData, 'technical')
                },
                {
                    icon: 'account_balance',
                    tooltip: 'Fundamental Insights',
                    onClick:(event, rowData) => handleSeeMore(rowData, 'fundamental')
                },
                {
                    icon: 'delete',
                    tooltip: 'Delete',
                    onClick:(event, rowData) => handleDelete(rowData)
                }
                ]}
                title={title}
                options={{
                    headerStyle: {
                        background: '#4682B4',
                        color: '#FFF'
                      },
                    actionsColumnIndex: -1,
                }}
        /> 
    );
}
 
export default DataTable;