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
                tooltip: 'Insights',
                onClick: (event, rowData) => handleSeeMore(rowData)
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
                    backgroundColor: '#4682B4',
                    color: '#FFF'
                  },
                actionsColumnIndex: -1,
            }}
        /> 
    );
}
 
export default DataTable;