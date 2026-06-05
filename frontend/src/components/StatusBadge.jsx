export default function StatusBadge({
 status
}){

const color = {

 PENDING:"warning",

 APPROVED:"success",

 REJECTED:"danger",

 CANCELLED:"secondary"

}[status];

return(

<span
 className={`badge bg-${color}`}
>

 {status}

</span>

);

}