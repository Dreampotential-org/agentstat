var search_item = `<div class="toc-two" agent_id=[[agent_id]]>
  <div class="row">
      <div class="toc-two-left">
          <div class="col-lg-3 col-12 col-md-3">
            <div class="toc-two-left-one">
              <img src="img/sh.png" alt="images not found">
            </div>
          </div>
          <div class="col-lg-9 col-12 col-md-9">
            <div class="toc-two-left-two">
              <div class="toc-two-left-two-heading">
                <div class="toc-two-left-two-heading-left">
                  <a href=[[agent_profile_link]] target="_blank"><h4>[[agent_name]]</h4></a>
                  <!--<h4>[[agent_name]] | <a href="#">Brokerage</a></h4>-->
                  <span>SCORE | [[score]]</span>
                </div>
                <div class="toc-two-left-two-heading-right toc-two-left-two-heading-right-next">
                  <a href="#"><i class="fas fa-thumbtack" aria-hidden="true"></i></a>
                  <p>Pin to top</p>
                </div>
              </div>
              <div class="ak-table">
                <table class="table table-borderless">
                  <tbody><tr>
                    <td></td>
                    <td><h5 class="m-0"><strong>Overall</strong></h5></td>
                    <td class="city_results"><h5 class="m-0"><strong>[[city]]</strong></h5></td>
                  </tr>
                  <tr>
                    <td><strong>Sold Listings</strong></td>
                    <td>[[overall_sold_listings]]</td>
                    <td class="city_results">[[sold_listings]]</td>
                  </tr>
                  <tr>
                    <td><strong>Failed Listings</strong></td>
                    <td>[[overall_failed_listings]]</td>
                    <td class="city_results">[[failed_listings]]</td>
                  </tr>
                  <tr>
                    <td><strong>Avg Days On Market</strong></td>
                    <td>[[overall_avg_dom]]</td>
                    <td class="city_results">[[avg_dom]]</td>
                  </tr>
                  <tr>
                    <td><strong>Avg Sold to List Price</strong></td>
                    <td>[[overall_s2l_price]]%</td>
                    <td class="city_results">[[s2l_price]]%</td>
                  </tr>
                  <tr>
                    <td><strong>Break Down</strong></td>
                    <td>[[overall_listings_breakdown_json]]</td>
                    <td class="city_results">[[listings_breakdown_json]]</td>
                  </tr>
                </tbody></table>

              </div>
              <div class="toc-two-left-two-link">
                <ul>
                  <!--<li><a href="#">Call [[cell_phone]]</a></li>-->
                  <li><a href="#" data-toggle="modal" data-agent-id="[[agent_id]]" data-target="#myModalx">Message</a></li>
                </ul>
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
                                <div class="two-link-left">
                                  <p>An Agentstat concierge will reach out to you within 60 seconds during business hours.</p>
                                  <p>Dis wazzup:</p>
                                  <p>1. An A-stat pro will reach out to go over your goals and answer any questions you may have.</p>
                                  <p>2. We'll do our best to connect you with [agent first name] and if you'd like, introduce you to other Agentstat Top 1% agents in the area.</p>
                                  <p>3. You sell your home quickly for top dollar!</p>
                                  <div class="modal-call">
                                    <p>Need immediate assistance?</p>
                                    <p>Call us ANYTIME at</p>
                                    <p>[[cell_phone]]</p>
                                  </div>
                                </div>
                              </div>
                              <div class="col-lg-6">
                                <div class="two-link-right">
                                    <table>
                                      <tbody><tr>
                                        <td> Name <span>*</span>:</td>
                                        <td><input type="text" id="name-[[agent_id]]" name="name"></td>
                                      </tr>
                                      <tr>
                                        <td> Phone <span>*</span>:</td>
                                        <td><input type="tel" id="phone-[[agent_id]]" name="" required=""></td>
                                      </tr>
                                      <tr>
                                        <td> Email <span>*</span>:</td>
                                        <td><input type="email" id="email-[[agent_id]]" name=""></td>
                                      </tr>
                                    </tbody></table>
                                    <label>Message</label>
                                    <textarea id="message-[[agent_id]]"></textarea>
                                    <div class="submit-btn">
                                      <button type="button" data-dismiss="modal">Cancel</button>
                                      <button class="lead-submit" data-id="[[agent_id]]">Submit</button>
                                      <div class="modal fade" id="con3">
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
                                    <div class="modal-form-content">
                                      <p id="msg-[[agent_id]]">
                                      </p>
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
            <ul>
              <!-- <li><a href="#">Call Agent Name</a></li> --!>
              <li><a href="#" data-toggle="modal" data-target="#myModal0">Message</a></li>
            </ul>
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
                            <div class="two-link-left">
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
                                        <button id="sum-[[agent_id]]" data-toggle="modal" data-target="#conx2" type="submit">Submit</button>
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
    <div class="col-lg-4 col-12">
      <div class="toc-two-right">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d136606.7447512607!2d-73.23218371314479!3d40.836504866505834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e81153da534b8f%3A0x63032a1963b35f70!2sFire%20Island%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1575111398221!5m2!1sen!2sbd" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </div>
  </div>
</div>`




var search_item_min = `<div class="toc-two" agent_id=[[agent_id]]>
  <div class="row" style="padding-bottom:20px">	
    <div class="col-lg-3 col-md-3">
    </div>
    <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">	
      <div class="toc-two-left-two">	
        <div class="ak-table">
          <table class="table-responsive">
            <tbody>
              <tr>
                <td colspan="2"><a href=[[agent_profile_link]] target="_blank"><h4>[[agent_name]] <span class="custom_score">SCORE | [[score]]</span> </h4> </a>
                  </td>
                  <td></td>
                  <td></td>
                <td class="text-center" ><div class="custom_pin"> <a href="#"><i class="fas fa-thumbtack"  style="color:#CC9D04" aria-hidden="true"></i></a>	
                <p>Unpin</p></div>
                  	</td>
              </tr>

              <tr>
                <td></td>
                <td ><h5 class="m-0"><strong>Overall</strong></h5></td>
                <td ><h5 class="m-0"><strong>Seattle</strong></h5></td>
                <td class="city_results"><h5 class="m-0"><strong>[[city]]</strong></h5></td>
              </tr>
              <tr >
                <td class="horizontal_dotted_line"><strong>Sold Listings</strong><span class="dot"></span></td>
                <td >[[overall_sold_listings]]</td>
                <td class="city_results">[[sold_listings]]</td>
              </tr>
              <tr >
                <td class="horizontal_dotted_line"><strong>Failed Listings</strong><span class="dot"></span></td>
                <td>[[overall_failed_listings]]</td>
                <td class="city_results">[[failed_listings]]</td>
              </tr>
              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong>Avg Days On Market</strong><span class="dot"></span></td>
                <td>[[overall_avg_dom]]</td>
                <td class="city_results">[[avg_dom]]</td>
                <td></td>
                <td></td>
                <td  class="toc-two-left-two-link text-center custom_btn"> 
                  <ul>	
                    <li><a href="#" data-toggle="modal" data-agent-id="156821" data-target="#myModalx">Call [[agent_name]]</a></li>	
                  </ul>
                </td>
              </tr>
              <tr class="custom_tr">
                <td class="horizontal_dotted_line"><strong>Avg Sold to List Price</strong><span class="dot"></span></td>
                <td >[[overall_s2l_price]]%</td>
                <td class="city_results">[[s2l_price]]%</td>
                <td></td>
                <td></td>
                <td  class="toc-two-left-two-link text-center custom_btn"> 
                  <ul style="padding-top:10px">	
                    <!--<li><a href="#">Call [[cell_phone]]</a></li>-->	
                    <li><a href="#" data-toggle="modal" data-agent-id="156821" data-target="#myModalx">Message</a></li>	
                  </ul>
                </td>
              </tr>
              <tr>
                <td class="horizontal_dotted_line"><strong>Break Down</strong><span class="dot"></span></td>
                <td>[[overall_listings_breakdown_json]]</td>
                <td class="city_results">[[listings_breakdown_json]]</td>
              </tr>
            </tbody>
          </table>
        </div >
    </div>
    <div class="text-center custom_div">
      <ul style="padding-top:10px">	
      <!--<li><a href="#">Call [[cell_phone]]</a></li>-->	
      <li><a href="#" data-toggle="modal" data-agent-id="156821" data-target="#myModalx">Call [[agent_name]]</a></li>	
      <li><a href="#" data-toggle="modal" data-agent-id="156821" data-target="#myModalx">Message</a></li>	
      </ul>
    <div>
  </div>
    


       <div class="toc-two-left-two-link text-center" style="margin: 15px 0px;">	
          <ul>	
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
                            <div class="two-link-left">	
                              <p>An Agentstat concierge will reach out to you within 60 seconds during business hours.</p>	
                              <p>Dis wazzup:</p>	
                              <p>1. An A-stat pro will reach out to go over your goals and answer any questions you may have.</p>	
                              <p>2. We'll do our best to connect you with [agent first name] and if you'd like, introduce you to other Agentstat Top 1% agents in the area.</p>	
                              <p>3. You sell your home quickly for top dollar!</p>	
                              <div class="modal-call">	
                                <p>Need immediate assistance?</p>	
                                <p>Call us ANYTIME at</p>	
                                <p>[[cell_phone]]</p>	
                              </div>	
                            </div>	
                          </div>	
                          <div class="col-lg-6">	
                            <div class="two-link-right">	
                                <table>	
                                  <tbody><tr>	
                                    <td> Name <span>*</span>:</td>	
                                    <td><input type="text" id="name-[[agent_id]]" name="name"></td>
                                  </tr>	
                                  <tr>	
                                    <td> Phone <span>*</span>:</td>	
                                    <td><input type="tel" id="phone-[[agent_id]]" name="" required=""></td>
                                  </tr>	
                                  <tr>	
                                    <td> Email <span>*</span>:</td>	
                                    <td><input type="email" id="email-[[agent_id]]" name=""></td>
                                  </tr>	
                                </tbody></table>	
                                <label>Message</label>	
                                <textarea id="message-156821"></textarea>	
                                <div class="submit-btn">	
                                  <button type="button" data-dismiss="modal">Cancel</button>	
                                  <button class="lead-submit" data-id="156821">Submit</button>	
                                  <div class="modal fade" id="con3">	
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
                                <div class="modal-form-content">	
                                  <p id="msg-[[agent_id]]">	
                                  </p>	
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
              <!-- <ul>
                <li><a href="#" data-toggle="modal" data-agent-id="156821" data-target="#myModalx">Call [[agent_name]]</a></li>	
                <li><a href="#" data-toggle="modal" data-target="#myModal0">Message</a></li>	
              </ul>	-->
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
                              <div class="two-link-left">	
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

