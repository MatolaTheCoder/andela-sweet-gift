function getStatus(status){
    let style
    switch(status){
        case 'delivered':
            style='capitalize py-1 px-2 rounded text-xs text-sky-600 bg-sky-100'
        case 'cancelled':
            style='capitalize py-1 px-2 rounded text-xs text-red-600 bg-red-100'
        case 'pending':
            style='capitalize py-1 px-2 rounded text-xs text-yellow-600 bg-yellow-100'        
    }
}