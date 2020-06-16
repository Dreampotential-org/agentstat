//
//
var referral_item = `
<tr data-toggle="collapse" data-target="#demo1" class="accordion-toggle">
    <td>
      <div class="downloadImgDiv"><img class="downloadImg" src="/img/download-icon.png"/></div>
    </td>
    <td>[[date]]</td>
    <td>[[referral_type]]</td>
    <td>[[referral_name]]</td>
    <td>[[agent_name]]</td>
    <td>[[referral_fee]]</td>
    <td>[[price]]</td>
    <td onclick="event.stopPropagation()">
        <select name="status" class="selectStatus">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="canceled">Canceled</option>
        </select>
    </td>
</tr>
<tr>
    <td colspan="12" class="hiddenRow">
        <div class="accordian-body collapse" id="demo1" style="text-align: left;"> 
            <p style="margin-bottom: 0px;">Email : [[email]]</p>
            <p style="margin-bottom: 0px;">Phone : [[phone]]</p>
        </div> 
    </td>
</tr>`;