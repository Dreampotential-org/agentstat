var search_item_min = `<div class="toc-two" agent_id=[[agent_id]]>
  <div class="row row_div" style="padding-bottom:20px">
    <div class="col-lg-3 col-md-3">
        [[agent_picture]]
    </div>
    <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
      <div class="toc-two-left-two">
        <div class="ak-table cust-tbl">
          <table >
            <tbody>
              <tr>
                  <td colspan="3"  class="title ">
                  <a  href=[[agent_profile_link]] target="_blank">
                  <h4 >[[agent_name]] <span class="custom_score hide_div"> | 
                  [[brokerage_info]]</span> 
                  <p class="custom_score show_div">[[brokerage_info]]</p>
                  </a></h4> 
                 
                    <span>SCORE | [[score]]</span>
                        
                  </td>
                 
                  <!-- <td colspan="2" class="toc-two-left-two-heading-right toc-two-left-two-heading-right-next text-center" >
                    <div class="custom_pin"> <a href="#">
                    <i class="fas fa-thumbtack custom_radio"  style="color:#CC9D04" aria-hidden="true"></i></a>
                    <p>Pin to top</p></div> 
                  </td>-->
                  <!-- <td colspan="2" class=" toc-two-left-two-heading-right toc-two-left-two-heading-right-next text-center" >
                  <label style="margin-bottom: 33px; "> 
                      <input type="checkbox" >
                      <span class="slide round"></span>
                  </label>
                    <p>Pin to top</p>
                  </td> -->

                  <td colspan="2" class="toc-two-left-two-heading-right toc-two-left-two-heading-right-next text-center" >
                    <div class="custom_pin"> 
                      <!--<a href="#"><i class="fas fa-toggle-on custom_radio  "  style="color:#CC9D04" aria-hidden="true"></i></a>-->
                      <a href="#" class="toggler">&nbsp;</a>
                      <p>Pin to top</p>
                    </div> 
                  </td>
              </tr>

              <tr>
                <td></td>
                <td><h5><strong >Overall</strong></h5></td>
                <td class="city_results" style="width:10%"><h5 ><strong>[[city]]</strong></h5></td> 
              </tr>
              <tr>
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Success Rate</strong><span class="dot"></span></td>
                <td>[[overall_success_rate]]%</td>
                <td class="city_results">[[success_rate]]%</td>
                <td style="width:10%"></td>
              </tr>
              <tr>
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Sold Listings</strong><span class="dot"></span></td>
                <td >[[overall_sold_listings]]</td>
                <td class="city_results">[[sold_listings]]</td>
                <td style="width:10%"></td>
                <td rowspan="4" class="toc-two-left-two-link text-center custom_btn btnmargin">
                  <ul>
                    <li><a href="#" data-toggle="modal" class='collect-lead'
                           data-agent-id="156821" data-target="#myModalx">Connect with [[agent_name]]</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr >
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Failed Listings</strong><span class="dot"></span></td>
                <td>[[overall_failed_listings]]</td>
                <td class="city_results">[[failed_listings]]</td>
                <td style="width:10%"></td>
              </tr>
              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Avg Days On Market</strong><span class="dot"></span></td>
                <td>[[overall_avg_dom]]</td>
                <td class="city_results">[[avg_dom]]</td>
                <td style="width:10%"></td>

              </tr>

              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Avg Sold to List Price</strong><span class="dot"></span></td>
                <td >[[overall_s2l_price]]%</td>
                <td class="city_results">[[s2l_price]]%</td>
                <td style="width:10%"></td>
              </tr>

              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Single Family Sold</strong><span class="dot"></span></td>
                <td >[[overall_single_family_sold]]</td>
                <td class="city_results">[[single_family_sold]]</td>
                <td style="width:10%"></td>
              </tr>


              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Condos Sold</strong><span class="dot"></span></td>
                <td >[[overall_condo_sold]]</td>
                <td class="city_results">[[condo_sold]]</td>
                <td style="width:10%"></td>
              </tr>

              <!-- <tr>
                <td class="horizontal_dotted_line"><strong style="padding-right: 10px;">Break Down</strong><span class="dot"></span></td>
                <td>[[overall_listings_breakdown_json]]</td>
                <td class="city_results">[[listings_breakdown_json]]</td>
                <td style="width:10%"></td>
              </tr>-->

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="text-center custom_div col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <ul style="padding-top:10px">
      <!--<li><a href="#">Call [[cell_phone]]</a></li>-->
      <li>
        <a href="#" data-toggle="modal" class='collect-lead' data-agent-id="156821" data-target="#myModalx">Connect with [[agent_name]]</a>
      </li>
      </ul>
    <div>
  </div>

      <div class="sm-list">
            <div class="row">
              <div class="col-4">
                <div class="toc-two-left-two-list-one text-center">
                  <h3>100%</h3>
                  <p>Sucess Rate</p>
                </div>
              </div>
              <div class="col-4">
                <div class="toc-two-left-two-list-one text-center">
                  <h3>18.4%</h3>
                  <p>Avg days on market</p>
                </div>
              </div>
              <div class="col-4">
                <div class="toc-two-left-two-list-one text-center">
                  <h3>103.26%</h3>
                  <p>Sucess Rate</p>
                </div>
              </div>
            </div>
            <div class="sm-link">
              <div class="modal fade" id="myModal0">
                <div class="modal-dialog modal-lg pt-modal modal-dialog-centered">
                  <div class="modal-content">

                    <div class="modal-body">
                      <div class="two-link-modal">
                        <div class="two-link-modal-heading text-center">
                          <h2>Contact [Agent Full Name]</h2>
                        </div>
                        <div class="two-link-modal-content">
                          <div class="row">	
                            <div class="col-lg-6">	
                              <div class="two-link-left ">	
                                <p>An Agentstat concierge will reach out to you within 60 seconds during business hours.</p>	
                                <p>Dis wazzup:</p>	
                                <p>1. An A-stat pro will reach out to go over your goals and answer any questions you may have.</p>	
                                <p>2. We'll do our best to connect you with [agent first name] and if you'd like, introduce you to other Agentstat Top 1% agents in the area.</p>	
                                <p>3. You sell your home quickly for top dollar!</p>	
                                <div class="modal-call">	
                                  <p>Need immediate assistance?</p>	
                                  <p>Call us ANYTIME at</p>	
                                  <p>(XXX) XXX - XXXX</p>	
                                </div>	
                              </div>	
                            </div>	
                            <div class="col-lg-6">	
                              <div class="two-link-right">	
                                <form>	
                                  <table>	
                                    <tbody><tr>	
                                      <td> Name <span>*</span>:</td>	
                                      <td><input type="text" name=""></td>	
                                    </tr>	
                                    <tr>	
                                      <td> Phone <span>*</span>:</td>	
                                      <td><input type="tel" name="" required=""></td>	
                                    </tr>	
                                    <tr>	
                                      <td> Email <span>*</span>:</td>	
                                      <td><input type="email" name=""></td>	
                                    </tr>	
                                  </tbody></table>	
                                  <label>Message</label>	
                                  <textarea></textarea>	
                                  <div class="submit-btn">	
                                    <div class="row no-gutters">	
                                      <div class="col-5">	
                                        <div class="btn-text text-left">	
                                          <p>Need immediate assistance?</p>	
                                          <p>Call us ANYTIME at</p>	
                                          <p>(XXX) XXX - XXXX</p>	

                                        </div>	
                                      </div>	
                                      <div class="col-7">	
                                        <div class="button-shape">	
                                          <button type="button" data-dismiss="modal">Cancel</button>	
                                          <button id="sum-156821" data-toggle="modal" data-target="#conx2" type="submit">Submit</button>	
                                          <div class="modal fade" id="conx2">	
                                            <div class="modal-dialog modal-md pt-another-modal modal-dialog-centered">	
                                              <div class="modal-content">	

                                                <div class="modal-body">	
                                                  <div class="another-modal">	
                                                    <div class="another-modal-content">	
                                                      <h2>Compelete!</h2>	
                                                      <p>[Agent Name] will contact you shortly :)</p>	
                                                      <button type="button" data-dismiss="modal">Cancel</button>	
                                                    </div>	
                                                  </div>	
                                                </div>	
                                              </div>	
                                            </div>	
                                          </div>	
                                        </div>	
                                      </div>	
                                    </div>	
                                  </div>	
                                  <div class="modal-form-content">	
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras efficitur ac metus a ullamcorper.</p>	
                                  </div>	
                                </form>	
                              </div>	
                            </div>	
                          </div>	
                        </div>	
                      </div>	
                    </div>	
                  </div>	
                </div>	
              </div>	
            </div>	
          </div>

        </div>
        </div>
        </div>`

var lead_collection = `
      <div class="toc-two-left-two-link text-center lead-collect-form" >	
            <div class="modal fade" id="myModalx">
              <div class="modal-dialog modal-lg pt-modal modal-dialog-centered">	
                <div class="modal-content">
                  <div class="modal-body modalh">
                    <div class="two-link-modal">	
                      <div class="two-link-modal-heading text-center">	
                        <h2>Contact [[agent_full_name]]</h2>	
                      </div>	
                      <div class="two-link-modal-content">	
                        <div class="row">	
                          <div class="col-lg-6">	
                            <div class="two-link-left custom_para">	
                              <p>An Agentstat concierge will reach out to you within 60 seconds during business hours.</p>	
                              <p>Dis wazzup:</p>	
                              <p>1.<span> An A-stat pro will reach out to go over your goals and answer any questions you may have.</span></p>	
                              <p>2.<span> We'll do our best to connect you with [agent first name] and if you'd like, introduce you to other Agentstat Top 1% agents in the area.</span></p>	
                              <p>3.<span> You sell your home quickly for top dollar!</span></p>	
                              <div class="modal-call">	
                                <p>Need immediate assistance?</p>	
                                <p>Call us ANYTIME at</p>	
                                <p>[[cell_phone]]</p>	
                              </div>	
                            </div>	
                          </div>	
                          <div class="col-lg-6">	
                            <div class="two-link-right">	
                            <div class="row " >
                              <div class="col-6 col-md-3 col-sm-3 div_name" >
                                <p>  Name <span style="color:red">*</span> :</p>
                              </div>
                              <div class="col-9 col-md-9 col-sm-9 div_input" >
                                <input type="text" id="name-[[agent_id]]" name="name">
                              </div>
                            </div>

                            <div class="row " >
                              <div class="col-6 col-md-3 col-sm-3 div_name" >
                                <p>  Phone <span style="color:red">*</span> :</p>
                              </div>
                              <div class="col-9 col-md-9 col-sm-9 div_input" >
                                <input type="tel" name="" required="">
                              </div>
                            </div>

                            <div class="row " >
                              <div class="col-6 col-md-3 col-sm-3 div_name" >
                                <p>  Email<span style="color:red">*</span> :</p>
                              </div>
                              <div class="col-9 col-md-9 col-sm-9 div_input" >
                                <input type="email" name="">
                              </div>
                            </div>
                            <div class="row " >
                              <div class="col-12 col-md-12 col-sm-9 " >
                                <p class="p_message"> Message</p>
                              </div>
                              <div class="col-12 col-md-12 col-sm-9 div_message" >
                              <textarea id="message-156821"></textarea>	
                              </div>
                            </div>
                            
                            <div class="submit-btn">	
                              <button type="button" data-dismiss="modal" class="font_btn">Cancel</button>	
                              <button class="lead-submit font_btn" data-id="156821">Submit</button>	
                              <div class="modal fade" id="con3">	
                                <div class="modal-dialog modal-md pt-another-modal modal-dialog-centered">	
                                  <div class="modal-content">	
                                    <div class="modal-body">	
                                      <div class="another-modal">	
                                        <div class="another-modal-content">	
                                          <h2>Compelete!</h2>	
                                          <p>[Agent Name] will contact you shortly :)</p>	
                                          <button type="button" data-dismiss="modal" >Cancel</button>	
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="modal-form-content">	
                            <p style="text-align:left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras efficitur ac metus a ullamcorper.</p>	
                            </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`
      

      

