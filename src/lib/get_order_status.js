export function getStatus(status){
    switch(status){
        case 'delivered':
            return 'capitalize py-1 px-2 rounded text-xs text-sky-600 bg-sky-100'
        case 'cancelled':
             return 'capitalize py-1 px-2 rounded text-xs text-red-600 bg-red-100'
        case 'pending':
            return'capitalize py-1 px-2 rounded text-xs text-yellow-600 bg-yellow-100' 
        default:
            return 'capitalize py-1 px-2 rounded text-xs text-yellow-600 bg-yellow-100'           
    }
}