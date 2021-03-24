/*
 * @Author: Cheng Bo 
 * @Date: 2019-06-27 14:04:08 
 * @Last Modified by: Cheng Bo
 * @Last Modified time: 2020-09-16 20:35:37
 * @Desc: 
 */
var comHotJobPage = 10;
var jobHotPagesize = 10;
var changePage = 　1;
var currentpage = 0;
var Records = null;

//$(document).off('click').on('click', '.ul_div_card', function(){
//	//点击进入企业招聘详情
//	var detailid = $(this).attr('data-detailid');
//	if (detailid) {
//      detailid = encodeURIComponent(detailid);
//      window.open('SearchOtherDetail.html?type=jobs&detailid=' + detailid)
//  }
//});

$(document).on("keydown", '#hotjob-changePage', function(event) {
    //回车后执行跳转页面操作
    switch (event.keyCode) {
        case 13:
            if (parseInt($(this).val()) && parseInt($(this).val()).toString().length == $(this).val().length) {
                var jumpPageNum = parseInt($(this).val());
                var allNum = $(this).parent().find("#jumpForad").attr('data-num');
                if (allNum <= jumpPageNum - 1) {
                    return false;
                }
                currentpage = parseInt($(this).val()) - 1;
                searchOtherDetail.getCompanyHotJob(searchOtherDetail.jobComCode);
            }
            return false;
            break;
    }
});

var searchOtherDetail = {
    type: '',
    detailid: '',
    announcementPart: '',
    jobComCode: '',
    init: function() {
        searchOtherDetail.type = wind.uri(location.href).query('type');
        searchOtherDetail.detailid = wind.uri(location.href).query('detailid');
        searchOtherDetail.announcementPart = wind.uri(location.href).query('announcementPart');
        searchOtherDetail.jobComCode = wind.uri(location.href).query('jobComCode');
        if (searchOtherDetail.type === 'brand') {
            $('#wrapper-brand').show();
            searchOtherDetail.loadBrandDetail();
        } else if (searchOtherDetail.type === 'patent') {
            $('#wrapper-patent').show();
            searchOtherDetail.loadPatentDetail();
        } else if (searchOtherDetail.type === 'judgment') {
            $('#wrapper-judgment').show();
            searchOtherDetail.loadJudgmentDetail();
        } else if (searchOtherDetail.type === 'dishonest') {
            $('#wrapper-dishonest').show();
            searchOtherDetail.loadDishonestDetail();
        } else if (searchOtherDetail.type === 'executee') {
            $('#wrapper-executee').show();
            searchOtherDetail.loadExecuteeDetail();
        } else if (searchOtherDetail.type === 'court') {
            $('#wrapper-court').show();
            searchOtherDetail.loadCourtDetail();
        } else if (searchOtherDetail.type === 'openNotice') {
            $('#wrapper-openNotice').show();
            searchOtherDetail.loadOpenNoticeDetail();
        } else if (searchOtherDetail.type === 'judicial') {
            $('#wrapper-judicial').show();
            searchOtherDetail.loadJudicialDetail();
        } else if (searchOtherDetail.type === 'jobs') {
            $('#wrapper-jobs').show();
            searchOtherDetail.loadJobsDetail();
        } else {
            $('#wrapper-404').show();
        }

        $(document).on('click', '.underline', function(e) {
            var target = e.target;
            var code = $(target).attr('data-code');
            var name = $(target).attr('data-name');
            if (code && code.length) {
                if (code.length < 16) {
                    Common.linkCompany('Bu3', code);
                } else {
                    window.open('Person.html?id=' + code + '&name=' + name);
                }
            }
            e.stopPropagation();
            return false;
        });
        $(document).on('click', '.paginate_button', function() {
            //点击翻页功能
            var pageHash = window.location.href.split('#')[1];
            if ($('.page-foucs').text() == $(this).text()) {
                return false;
            }
            if ($(this).attr('id') == 'jumpForad' || $(this).attr('id') == 'jumpAfter') {
                var jumpNum = $(this).attr('id') == 'jumpForad' ? currentpage - 1 : currentpage + 1;
                if (jumpNum < 0 || jumpNum >= $(this).attr('data-num')) {
                    return false;
                } else {
                    currentpage = jumpNum;
                }
            } else {
                currentpage = parseInt($(this).text()) - 1;
            }
            searchOtherDetail.getCompanyHotJob(searchOtherDetail.jobComCode);
            return false;
        });
        $(document).on('click', '.ul_div_card', function() {
            //点击进入企业招聘详情
            var detailid = $(this).attr('data-detailid');
            var ccode = $(this).attr('data-code');
            if (detailid) {
                detailid = encodeURIComponent(detailid);
                window.open('SearchOtherDetail.html?type=jobs&detailid=' + detailid + '&jobComCode=' + ccode);
            }
            return false;
        });
    },
    loadBrandDetail: function() {
        myWfcAjax("getbranddetail", { detailid: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data) {
                var item = res.Data;
                var special_term = '';
                if (item.special_term) {
                    var special_start = item.special_term.split('~')[0] ? Common.formatTime(item.special_term.split('~')[0]) : '--';
                    var special_end = item.special_term.split('~')[1] ? Common.formatTime(item.special_term.split('~')[1]) : '--';
                    special_term = special_start + '~' + special_end;
                } else {
                    special_term = '--';
                }

                $('.module-brand-header-img img').attr('src', item.brand_graphic_link);
                $('.module-brand-table-img img').attr('src', item.brand_graphic_link);

                $('#header-brand-name').text((item.brand_name ? item.brand_name : '--'));
                $('#header-brand-state').text((item.brand_state ? item.brand_state : '--'));
                $('#header-brand-number').text((item.brand_reg_no ? item.brand_reg_no : '--'));
                $('#header-brand-applydate').text((item.apply_date ? Common.formatTime(item.apply_date) : "--"));
                $('#header-brand-type').text((item.inner_type ? item.inner_type : '--'));
                $('#brand-name').text((item.brand_name ? item.brand_name : '--'));
                $('#brand-reg-no').text((item.brand_reg_no ? item.brand_reg_no : '--'));
                $('#brand-state').text((item.brand_state ? item.brand_state : '--'));
                $('#brand-class').text((item.inner_type ? item.inner_type : '--'));
                $('#brand-apply-date').text((item.apply_date ? Common.formatTime(item.apply_date) : "--"));
                $('#brand-use-delay').text(special_term);
                $('#brand-type').text((item.brand_type ? item.brand_type : "--"));
                $('#brand-first-no').text((item.brand_audit_report_no ? item.brand_audit_report_no : "--"));
                $('#brand-first-date').text((item.brand_audit_report_time ? Common.formatTime(item.brand_audit_report_time) : "--"));
                $('#brand-reg-number').text((item.brand_reg_report_no ? item.brand_reg_report_no : "--"));
                $('#brand-reg-date').text((item.brand_reg_report_time ? Common.formatTime(item.brand_reg_report_time) : "--"));
                $('#brand-intel-date').text((item.inter_reg_date ? Common.formatTime(item.inter_reg_date) : "--"));
                $('#brand-after-date').text((item.later_specified_date ? Common.formatTime(item.later_specified_date) : "--"));
                $('#brand-zero-date').text((item.priority_date ? Common.formatTime(item.priority_date) : "--"));
                $('#brand-color').text((item.color_combination ? item.color_combination : '--'));
                $('#brand-apply-man-zh').text((item.applicant_chinese_name ? item.applicant_chinese_name : '--'));
                $('#brand-apply-addr-zh').text((item.applicant_chinese_adress ? item.applicant_chinese_adress : '--'));
                $('#brand-apply-man-en').text((item.applicant_english_name ? item.applicant_english_name : '--'));
                $('#brand-apply-addr-en').text((item.applicant_english_adress ? item.applicant_english_adress : '--'));
                var is_common_brand = item.is_common_brand ? item.is_common_brand : "--";
                if (is_common_brand == "0") {
                    is_common_brand = "否";
                } else if (is_common_brand == "1") {
                    is_common_brand = "是";
                }
                $('#brand-many').text(is_common_brand);

                var agentId = item.brand_agent_org_id ? item.brand_agent_org_id : '';
                if (agentId) {
                    $('#brand-agent').append('<a class="wi-link-color wi-secondary-color underline" href="#" data-name=' + item.brand_agent_org + ' data-code=' + item.brand_agent_org_id + '>' + (item.brand_agent_org ? item.brand_agent_org : '--') + '</a>')
                } else {
                    $('#brand-agent').text((item.brand_agent_org ? item.brand_agent_org : '--'));
                }
                $('#brand-detail').text((item.brand_item ? item.brand_item : '--'));
            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);

    },
    showPatentPdf: function(data) {
        //专利pdf
        console.log(data)
        var tmpArr = [];
        for (var i = 0; i < data.length; i++) {
            var pdfStr = "";
            if (data[i].name && data[i].url) {
                pdfStr = '<a target="_blank" class="wi-link-color wi-secondary-color" href="' + data[i].url + '">' + data[i].name + '</a>'
            } else {
                pdfStr = data[i].name
            }
            tmpArr.push('<tr><td>' + (i + 1) + '</td><td>' + pdfStr + '</td><td>' + (data[i].status ? data[i].status : "--") + '</td></tr>')
        }
        console.log(tmpArr.join(""))
        $("#pdfList").html(tmpArr.join(""))
    },
    loadPatentDetail: function() {
        //专利
        myWfcAjax("getpatentdetail", { applyNumber: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data) {
                var item = res.Data[0];
                $('#patent-name').text((item['PatentName'] ? item['PatentName'] : '--'));
                $('#patent-number').text((item['ApplyNumber'] ? item['ApplyNumber'] : '--'));
                $('#patent-apply-date').text((item['ApplyData'] ? Common.formatTime(item['ApplyData']) : '--'));
                $('#patent-code').text((item['GrantAuthorizationNumber'] ? item['GrantAuthorizationNumber'] : '--'));
                $('#patent-state').text((item['LawStatus'] ? item['LawStatus'] : '--'));
                $('#patent-type').text((item['PatentType'] ? item['PatentType'] : '--'));
                $('#patent-class-type').text((item['ClassificationNumber'] ? item['ClassificationNumber'] : '--'));
                $('#patent-class').text((item['ClassificationName'] ? item['ClassificationName'] : '--'));
                var applyManStr = "";
                if (item.applyPersonList && item.applyPersonList.length) {
                    item.applyPersonList.map(function(t) {
                        if (applyManStr) {
                            applyManStr += ', ';
                        }
                        if (t.ApplyPersonId) {
                            applyManStr += '<a class="wi-link-color wi-secondary-color underline" href="#" data-name=' + t['ApplyPerson'] + ' data-code=' + t['ApplyPersonId'] + '>' + Common.formatCont(t['ApplyPerson']) + '</a>'
                        } else {
                            applyManStr += Common.formatCont(t.ApplyPerson);
                        }
                    })
                };
                //pdf文件
                myWfcAjax("getpatentdetailpdf", { patentId: item['ApplyNumber'] }, function(data) {
                        var res = JSON.parse(data);
                        if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
                            searchOtherDetail.showPatentPdf(res.Data)
                        } else {
                            $("#pdfList").find("td").html("暂无数据")
                        }
                    }, function() {
                        $("#pdfList").find("td").html("暂无数据")
                    })
                    //专利权利要求
                myWfcAjax("getpatentdetailright", { patentId: item['ApplyNumber'] }, function(data) {
                        var res = JSON.parse(data);
                        if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
                            if (res.Data[0].content && res.Data[0].content.length > 0) {
                                $("#rightContent").html(res.Data[0].content);
                            } else {
                                $("#rightContent").html("暂无数据");
                            }
                        } else {
                            $("#rightContent").html("暂无数据");
                        }
                    }, function() {
                        $("#rightContent").html("暂无数据");
                    })
                    // 说明书
                myWfcAjax("getpatentdetailinstruction", { patentId: item['ApplyNumber'] }, function(data) {
                    var res = JSON.parse(data);
                    if (res.ErrorCode == 0 && res.Data && res.Data.length > 0) {
                        if (res.Data[0].content && res.Data[0].content.length > 0) {
                            $("#directionContent").html(res.Data[0].content);
                        } else {
                            $("#directionContent").html("暂无数据");
                        }
                    } else {
                        $("#directionContent").html("暂无数据");
                    }
                }, function() {
                    $("#directionContent").html("暂无数据");
                })
                var applyStrucStr = "";
                if (item['AgentId']) {
                    applyStrucStr = '<a class="wi-link-color wi-secondary-color underline" href="#" data-name=' + item['BrokerArchitectures'] + ' data-code=' + item['AgentId'] + '>' + Common.formatCont(item['BrokerArchitectures']) + '</a>'
                } else {
                    applyStrucStr = Common.formatCont(item['BrokerArchitectures']);
                }
                $('#patent-apply-man').html(applyManStr);
                $('#patent-second-man').text((item['Agent'] ? item['Agent'] : '--'));
                $('#patent-first-man').text((item['Inventor'] ? item['Inventor'] : '--'));
                $('#patent-desc').text((item['Abstract1'] ? item['Abstract1'] : '--'));
                $('#local-first').text((item['LocalPriority'] ? item['LocalPriority'] : '--'));
                $("#patent-second-struc").html(applyStrucStr)
                $('#foreign-first').text((item['ForeignPriority'] ? item['ForeignPriority'] : '--'));
                $('#patent-type-msg').html((item['ClassificationDescription'] && item['ClassificationDescription'].length ? item['ClassificationDescription'].join('</br>') : '--'));
                var showPatent = [];
                if (item['PatentImage']) {
                    var patentImageArr = item['PatentImage'].split(",");
                    for (var i = 0; i < patentImageArr.length; i++) {
                        showPatent.push('<img class="patent-imgs" src="' + patentImageArr[i] + '" />')
                    }
                    $('#patentImgList').html(showPatent.join(""))
                }

                if (item['laws'] && item['laws'].length > 0) {
                    //法律状态
                    var htmlArr = []
                    for (var i = 0; i < item['laws'].length; i++) {
                        var tmpData = Common.formatTime(item['laws'][i].annTime);
                        var tmpStatus = Common.formatCont(item['laws'][i].lawStatus);
                        var tmpDesc = Common.formatCont(item['laws'][i].lawDesc);
                        htmlArr.push('<tr><td>' + (i + 1) + '</td><td>' + tmpData + '</td><td>' + tmpStatus + '</td><td>' + tmpDesc + '</td></tr>');
                    }
                    $("#lawList").html(htmlArr.join(""))
                } else {
                    $("#lawList").find("td").html("暂无数据")
                }
            } else {
                searchOtherDetail.loadError();
            }

        }, searchOtherDetail.loadError);
    },
    loadJudgmentDetail: function() {
        myWfcAjax("getjudgeinfodetail", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;
                $('#judgment-title').text((item['case_title'] ? item['case_title'] : '--'));
                $('#judgment-case-no').text((item['case_no'] ? item['case_no'] : '--'));
                $('#judgment-case-type').text((item['case_type_detail'] ? item['case_type_detail'] : '--'));
                $('#judgment-time').text((item['judge_time'] ? Common.formatTime(item['judge_time']) : '--'));
                $('#judgment-court').text((item['court_name'] ? item['court_name'] : '--'));
                $('#judgment-area').text((item['area_name'] ? item['area_name'] : '--'));
                $('#judgment-content').append((item['judge_content'] ? item['judge_content'] : '--'));

                var prosecutor = item['prosecutor'];
                var defendant = item['defendant'];
                var all_party = prosecutor.concat(defendant);
                var prosecutor_dic = {};
                var defendant_dic = {};
                var htmlStr = '';
                if (all_party && all_party.length > 0) {
                    if (prosecutor && prosecutor.length > 0) {
                        for (var i = 0; i < prosecutor.length; i++) {
                            var pro_item = prosecutor[i];
                            var pro_key = pro_item.split("-")[0].replace(/(^\s*)|(\s*$)/g, "");
                            var pro_name_code = pro_item.split("-")[1].replace(/(^\s*)|(\s*$)/g, "");
                            var pro_name = pro_name_code.split('|')[0];
                            var pro_code = pro_name_code.split('|')[1];
                            var pro_input = pro_code ? Common.jumpPersonOrCompany(pro_name, pro_code) : pro_name;
                            if (prosecutor_dic.hasOwnProperty(pro_key)) {
                                prosecutor_dic[pro_key].push(pro_input);
                            } else {
                                prosecutor_dic[pro_key] = [];
                                prosecutor_dic[pro_key].push(pro_input);
                            }
                        }
                    }
                    for (var p_key in prosecutor_dic) {
                        var p_value = prosecutor_dic[p_key].join(',');
                        htmlStr += p_key + ' - ' + p_value + '<br/>';
                    }
                    if (defendant && defendant.length > 0) {
                        for (var i = 0; i < defendant.length; i++) {
                            var def_item = defendant[i];
                            var def_key = def_item.split("-")[0].replace(/(^\s*)|(\s*$)/g, "");
                            var def_name_code = def_item.split("-")[1].replace(/(^\s*)|(\s*$)/g, "");
                            var def_name = def_name_code.split('|')[0];
                            var def_code = def_name_code.split('|')[1];
                            var def_input = def_code ? Common.jumpPersonOrCompany(def_name, def_code) : def_name;
                            if (defendant_dic.hasOwnProperty(def_key)) {
                                var str = '';
                                defendant_dic[def_key].push(def_input);
                            } else {
                                defendant_dic[def_key] = [];
                                defendant_dic[def_key].push(def_input);
                            }
                        }
                    }
                    for (var p_key in defendant_dic) {
                        var p_value = defendant_dic[p_key].join(',');
                        htmlStr += p_key + ' - ' + p_value + '<br/>';
                    }

                    $("#judgment-party").append(htmlStr);
                    $("#judgment-party").find('a').removeClass("underline");
                    $("#judgment-party").find('a').addClass("pointer-a");
                } else {
                    $("#judgment-party").text("--");
                }


            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadDishonestDetail: function() {
        myWfcAjax("getdiscredictedpersondetail", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;

                var htmlArr = [];
                htmlArr.push('<h5 class="dishonest-brand' + (item['concerned_person_id'].replace(/(^\s*)|(\s*$)/g, "") ? " wi-link-color jump-page underline" : "") + '" data-code="' + (item['concerned_person_id'] ? item['concerned_person_id'] : NaN) + '" >' + (item['concerned_person_name'] ? item['concerned_person_name'] : '--') + '</h5>')
                htmlArr.push('<div class="dishonest-item">')
                htmlArr.push('<span class="dishonest-span">' + intl('138435' /*被执行人的履行情况*/ ) + '：' + (item['performance'] ? item['performance'] : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('<span class="dishonest-span">' + intl('138190' /*案号*/ ) + '：' + (item['case_no'] ? item['case_no'] : '--') + '</span>')
                htmlArr.push('<span class="dishonest-span">' + intl('138294' /*立案时间*/ ) + '：' + (item['filing_time'] ? Common.formatTime(item['filing_time']) : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('</div>')
                $("#dishonest-tab-content").append(htmlArr.join(""));

                $('#dishonest-person').text((item['concerned_person_name'] ? item['concerned_person_name'] : '--'));
                if (item['concerned_person_id'].replace(/(^\s*)|(\s*$)/g, "")) {
                    $("#dishonest-person").addClass("wi-link-color underline");
                    $("#dishonest-person").attr("data-code", (item['concerned_person_id'] ? item['concerned_person_id'] : NaN));
                }
                $('#dishonest-case-no').text((item['case_no'] ? item['case_no'] : '--'));
                $('#dishonest-release-time').text((item['release_time'] ? Common.formatTime(item['release_time']) : '--'));
                $('#dishonest-filing-time').text((item['filing_time'] ? Common.formatTime(item['filing_time']) : '--'));
                $('#dishonest-area').text((item['area_name'] ? item['area_name'] : '--'));
                $('#dishonest-court').text((item['execution_court'] ? item['execution_court'] : '--'));
                $('#dishonest-basis-no').text((item['execution_basis_no'] ? item['execution_basis_no'] : '--'));
                $('#dishonest-authority').text((item['decision_authority'] ? item['decision_authority'] : '--'));
                $('#dishonest-performance').text((item['performance'] ? item['performance'] : '--'));
                $('#dishonest-behavior').text((item['behavior'] ? item['behavior'] : '--'));
                $('#dishonest-duty').text((item['duty'] ? item['duty'] : '--'));
            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadExecuteeDetail: function() {
        //被执行人
        myWfcAjax("getconcernedpersondetail", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;
                $('#executee-person').text((item['concerned_person_name'] ? item['concerned_person_name'] : '--'));
                if (item['corp_id'].replace(/(^\s*)|(\s*$)/g, "")) {
                    $("#executee-person").addClass("wi-link-color underline");
                    $("#executee-person").attr("data-code", (item['corp_id'] ? item['corp_id'] : NaN));
                }
                $('#executee-social').text((item['social_code'] ? item['social_code'] : '--'));
                $('#executee-case-no').text((item['case_no'] ? item['case_no'] : '--'));
                $('#executee-target').text((item['execution_target'] ? item['execution_target'] : '--'));
                $('#executee-filing-time').text((item['filing_time'] ? Common.formatTime(item['filing_time']) : '--'));
                $('#executee-court').text((item['execution_court'] ? item['execution_court'] : '--'));

            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadCourtDetail: function() {
        //法院公告
        myWfcAjax("getcourtannouncementdetail2", { announcementno: searchOtherDetail.detailid, announcementPart: searchOtherDetail.announcementPart }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;

                var htmlArr = [];
                htmlArr.push('<h5 class="court-brand"></h5>')
                htmlArr.push('<div class="court-item">')
                htmlArr.push('<span class="court-span">' + intl('138147' /*公示类型*/ ) + '：' + (item['announcement_type'] ? item['announcement_type'] : '--') + '</span>')
                htmlArr.push('<span class="court-span">' + intl('138196' /*案由*/ ) + '：' + (item['announcement_cause'] ? item['announcement_cause'] : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('<span class="court-span">' + intl('138148' /*公告人*/ ) + '：' + (item['announcer'] ? item['announcer'] : '--') + '</span>')
                htmlArr.push('<span class="court-span">' + intl('138144' /*公示时间*/ ) + '：' + (item['announcement_time'] ? Common.formatTime(item['announcement_time']) : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('</div>')
                $("#court-tab-content").append(htmlArr.join(""));

                $('#court-type').text((item['announcement_type'] ? item['announcement_type'] : '--')); //公告类型
                $('#court-case-no').text((item['announcement_no'] ? item['announcement_no'] : '--')); //案号
                $('#court-announcement-time').text((item['announcement_time'] ? Common.formatTime(item['announcement_time']) : '--')); //公告时间
                //进行跳转拆分
                var announcement_party = item['announcement_party'];
                var announcement_party_dic = {};
                var htmlStr = '';
                if (announcement_party && announcement_party.length > 0) {
                    var announcement_party_arr = announcement_party.split(',');
                    for (var i = 0; i < announcement_party_arr.length; i++) {
                        var pro_item = announcement_party_arr[i];
                        var pro_key = pro_item.split("-")[0].replace(/(^\s*)|(\s*$)/g, "");
                        var pro_name_code = pro_item.split("-")[1].replace(/(^\s*)|(\s*$)/g, "");
                        var pro_name = pro_name_code.split('|')[0];
                        var pro_code = pro_name_code.split('|')[1];
                        var pro_input = pro_code ? Common.jumpPersonOrCompany(pro_name, pro_code) : pro_name;
                        if (announcement_party_dic.hasOwnProperty(pro_key)) {
                            announcement_party_dic[pro_key].push(pro_input);
                        } else {
                            announcement_party_dic[pro_key] = [];
                            announcement_party_dic[pro_key].push(pro_input);
                        }
                    }
                    var title_value = '';
                    for (var p_key in announcement_party_dic) {
                        var p_value = announcement_party_dic[p_key].join(',');
                        title_value += announcement_party_dic[p_key].join(',') + ',';
                        htmlStr += p_key + ' - ' + p_value + '<br/>';
                    }
                    title_value = title_value.substring(0, title_value.length - 1);

                    $("#court-party").append(htmlStr);
                    $("#court-party").find('a').removeClass("underline");
                    $("#court-party").find('a').addClass("pointer-a");
                    $(".court-brand").html(title_value);
                    $(".court-brand").find('a').removeClass("underline");
                    $(".court-brand").find('a').addClass("pointer-a");
                } else {
                    $("#court-party").text("--");
                }

                $('#court-announcer').text((item['announcer'] ? item['announcer'] : '--')); //公告人
                $('#court-content').html((item['announcement_content'] ? item['announcement_content'].split("\n").join("<br />") : '--')); //公告内容
            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadOpenNoticeDetail: function() {
        //开庭公告
        myWfcAjax("gettrialnoticedetail2", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;

                var htmlArr = [];
                htmlArr.push('<h5 class="openNotice-brand ">' + (item['announcement_cause'] ? item['announcement_cause'] : '--') + '</h5>')
                htmlArr.push('<div class="openNotice-item">')
                htmlArr.push('<span class="openNotice-span">' + intl('138190' /*案号*/ ) + '：' + (item['announcement_no'] ? item['announcement_no'] : '--') + '</span>')
                htmlArr.push('<span class="openNotice-span">' + intl('138229' /*开庭时间*/ ) + '：' + (item['court_time'] ? Common.formatTime(item['court_time']) : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('<span class="openNotice-span openNotice-title-people"></span>')
                htmlArr.push('<br>')
                htmlArr.push('</div>')
                $("#openNotice-tab-content").append(htmlArr.join(""));

                $('#openNotice-case-no').text((item['announcement_no'] ? item['announcement_no'] : '--'));
                $('#openNotice-opening-time').text((item['court_time'] ? Common.formatTime(item['court_time']) : '--'));
                $('#openNotice-announcement-time').text((item['announcement_time'] ? Common.formatTime(item['announcement_time']) : '--'));
                $('#openNotice-case-type').text((item['announcement_cause'] ? item['announcement_cause'] : '--'));
                //进行跳转拆分
                var announcement_party = item['announcement_party'];
                var announcement_party_dic = {};
                var htmlStr = '';
                if (announcement_party && announcement_party.length > 0) {
                    var announcement_party_arr = announcement_party.split(',');
                    for (var i = 0; i < announcement_party_arr.length; i++) {
                        var pro_item = announcement_party_arr[i];
                        var pro_key = pro_item.split("-")[0].replace(/(^\s*)|(\s*$)/g, "");
                        var pro_name_code = pro_item.split("-")[1].replace(/(^\s*)|(\s*$)/g, "");
                        var pro_name = pro_name_code.split('|')[0];
                        var pro_code = pro_name_code.split('|')[1];
                        var pro_input = pro_code ? Common.jumpPersonOrCompany(pro_name, pro_code) : pro_name;
                        if (announcement_party_dic.hasOwnProperty(pro_key)) {
                            announcement_party_dic[pro_key].push(pro_input);
                        } else {
                            announcement_party_dic[pro_key] = [];
                            announcement_party_dic[pro_key].push(pro_input);
                        }
                    }
                    var title_value = '';
                    for (var p_key in announcement_party_dic) {
                        var p_value = announcement_party_dic[p_key].join(',');
                        title_value += announcement_party_dic[p_key].join(',') + ',';
                        htmlStr += p_key + ' - ' + p_value + '<br/>';
                    }
                    title_value = title_value.substring(0, title_value.length - 1);

                    $("#openNotice-defendant").append(htmlStr);
                    $("#openNotice-defendant").find('a').removeClass("underline");
                    $("#openNotice-defendant").find('a').addClass("pointer-a");
                    $(".openNotice-title-people").html(intl('138427' /*当事人*/ ) + '：' + title_value);
                    $(".openNotice-title-people").find('a').removeClass("underline");
                    $(".openNotice-title-people").find('a').addClass("pointer-a");
                } else {
                    $("#openNotice-defendant").text("--");
                    $(".openNotice-title-people").text(intl('138427' /*当事人*/ ) + '：--');
                }
                $('#openNotice-content').html((item['announcement_content'] ? item['announcement_content'].split("\n").join("<br />") : '--'));

            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadJudicialDetail: function() {
        //司法拍卖
        myWfcAjax("getjudicialsaledetail", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;

                var htmlArr = [];
                htmlArr.push('<h5 class="judicial-brand">' + (item['sale_title'] ? item['sale_title'] : '--') + '</h5>')
                htmlArr.push('<div class="judicial-item">')
                htmlArr.push('<span class="judicial-span">' + intl('138515' /*起拍价*/ ) + '：' + (item['starting_price'] ? item['starting_price'] : '--') + '</span>')
                htmlArr.push('<span class="judicial-span">' + intl('138237' /*拍卖日期*/ ) + '：' + (item['sort_date'] ? Common.formatTime(item['sort_date']) : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('<span class="judicial-span">' + intl('138227' /*拍卖法院*/ ) + '：' + (item['sale_court'] ? item['sale_court'] : '--') + '</span>')
                htmlArr.push('<br>')
                htmlArr.push('</div>')
                $("#judicial-tab-content").append(htmlArr.join(""));

                $('#judicial-title').text((item['sale_title'] ? item['sale_title'] : '--'));
                $('#judicial-target').text((item['sale_target'] ? item['sale_target'] : '--'));
                $('#judicial-target-introduction').text((item['target_introduction'] ? item['target_introduction'] : '--'));
                $('#judicial-file').text((item['documents_provided'] ? item['documents_provided'] : '--'));
                $('#judicial-court').text((item['sale_court'] ? item['sale_court'] : '--'));
                $('#judicial-auction-time').text((item['sale_date'] ? item['sale_date'] : '--'));
                $('#judicial-auction-rotation').text((item['sale_turn'] ? item['sale_turn'] : '--'));
                $('#judicial-auction-state').text((item['sale_status'] ? item['sale_status'] : '--'));
                $('#judicial-auction-result').text((item['sale_result'] ? item['sale_result'] : '--'));
                $('#judicial-starting-price').text((item['starting_price'] ? item['starting_price'] : '--'));
                $('#judicial-bond').text((item['deposit'] ? item['deposit'] : '--'));
                $('#judicial-valuation').text((item['valuation_price'] ? item['valuation_price'] : '--'));
                $('#judicial-margin').text((item['increase_range'] ? item['increase_range'] : '--'));
                $('#judicial-sources').text((item['power_source'] ? item['power_source'] : '--'));
                $('#judicial-warrants').text((item['warrant_situation'] ? item['warrant_situation'] : '--'));
                $('#judicial-limitation').text((item['power_limitation'] ? item['power_limitation'] : '--'));
                $('#judicial-describe').text((item['target_status_description'] ? item['target_status_description'] : '--'));

            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
    },
    loadJobsDetail: function() {
        //招聘信息
        myWfcAjax("getrecruimentdetail", { detailId: searchOtherDetail.detailid }, function(data) {
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var item = res.Data;
                var htmlArr = [];
                var companyLink = item["company_code"] ? ('<a class="wi-link-color wi-secondary-color underline" href="" data-code="' + item["company_code"] + '">' + item["company_name"] + '</a>') : item["company_name"];
                htmlArr.push('<h5 class="jobs-brand">' + (item['position_name'] ? item['position_name'] : '--') + '</h5>')
                htmlArr.push('<span class="jobs-span-title-right">' + item['salary_range'] + '</span>')
                htmlArr.push('<div class="jobs-item">')
                htmlArr.push('<span class="jobs-span">' + (item['city'] ? item['city'] : '--') + '</span><span class="jobs-span">|</span><span class="jobs-span">' + (item['work_experience'] ? item['work_experience'] : '--') + '</span><span class="jobs-span">|</span><span class="jobs-span">' + (item['degree'] ? item['degree'] : '--') + '</span><span class="jobs-span">|</span><span class="jobs-span">' + companyLink + '</span>')
                var sourceName = item['source_url'] ? ('<a target="_blank" class="wi-secondary-color wi-link-color" href="' + (item['source_url']) + '">' + (item['source_name']) + '</a>') : (item['source_name'] ? item['source_name'] : '--');
                htmlArr.push('<span class="jobs-span-right">' + intl('9754' /*来源*/ ) + '：' + sourceName + '</span>')
                htmlArr.push('</div>')
                $("#jobs-tab-content").append(htmlArr.join(""));

                //              $("#jobs-detail-content").html(item['job_duty']);//职位描述
                //这里需要进行修改
                if (item['post_benefits'] || item['job_duty'] || item['job_requirements']) {
                    if (item['post_benefits']) {
                        $('#job-benefits-item').html(item['post_benefits']);
                    } else {
                        $('#job-benefits').hide();
                    }
                    if (item['job_duty']) {
                        $('#job-duty-item').html(item['job_duty']);
                    } else {
                        $('#job-duty').hide();
                    }
                    if (item['job_requirements']) {
                        $('#job-requirements-item').html(item['job_requirements']);
                    } else {
                        $('#job-requirements').hide();
                    }
                } else {
                    $("#jobs-detail-content").html('--');
                }
                if (searchOtherDetail.jobComCode == "undefined" && item["company_code"]) {
                    searchOtherDetail.jobComCode = item["company_code"];
                    searchOtherDetail.getCompanyHotJob(item["company_code"]); //企业热招职位
                }

            } else {
                searchOtherDetail.loadError();
            }
        }, searchOtherDetail.loadError);
        if (searchOtherDetail.jobComCode != "undefined") {
            searchOtherDetail.getCompanyHotJob(searchOtherDetail.jobComCode); //企业热招职位
        }
    },
    getCompanyHotJob: function(ccode) {
        //接下来是企业热招职位    

        var comHotJobParam = { companycode: ccode, PageSize: 10, PageNo: currentpage };
        myWfcAjax("getrecurit", comHotJobParam, function(data) {
            //      	var data = '{"data":{"total":100,"list":[{"education":"大专","city":"上海","OB_OBJECT_ID":"014cb15f-bb2f-4d67-9f0f-a9de6a79679a","company_name":"上海安捷力信息系统有限公司","pay":"2K-3K","company_code":"1168152377","job":"数据处理(实习生)","experience":"经验不限","release_time":"20180531"},{"education":"大专","city":"上海","OB_OBJECT_ID":"014cb15f-bb2f-4d67-9f0f-a9de6a79679a","company_name":"上海安捷力信息系统有限公司","pay":"2K-3K","company_code":"1168152377","job":"数据处理(实习生)","experience":"经验不限","release_time":"20180531"}]},"errorCode":"0","errorMessage":null,"page":null}';
            var res = JSON.parse(data);
            if (res.ErrorCode == 0 && res.Data && res.Data.length != 0) {
                var allNum = res.Page.Records; //总数
                var listNum = res.Data.length; //新一页长度
                var htmlTotle = [];
                $('.job-list-num').html("(" + allNum + ")");
                $('#hotJobList').empty(); //只有第一次进才清空
                htmlTotle.push('<ul class="ul-cont"></ul>');
                htmlTotle.push('<div class="change-page dataTables_wrapper"></div>');
                $('#hotJobList').append(htmlTotle.join(''));
                Records = allNum;
                searchOtherDetail.pageTurning(currentpage + 1, jobHotPagesize);

                for (var i = 0; i < listNum; i++) {
                    var item = res.Data[i];
                    var jobName = item['job'] ? item['job'] : '--'; //职位名称
                    var salary = item['pay'] ? item['pay'] : '--'; //薪资
                    var outTime = item['release_time'] ? Common.formatTime(item['release_time']) : '--'; //发布时间
                    var companyName = item['company_name'] ? item['company_name'] : '--'; //招聘企业
                    var companyCode = item['company_code'] ? item['company_code'] : '';
                    var jumpItem = companyCode ? '<a class="wi-link-color wi-secondary-color underline" href="" data-code="' + companyCode + '">' + companyName + '</a>' : companyName;
                    var needEdu = item['education'] ? item['education'] : '--'; //学历要求
                    var workPlace = item['city'] ? item['city'] : '--'; //工作地点
                    var needExp = item['experience'] ? item['experience'] : '--'; //经验要求
                    var jobDetailId = item['OB_OBJECT_ID'] ? item['OB_OBJECT_ID'] : ''; //招聘详情id

                    //数据展示
                    var divHtml = [];
                    divHtml.push('<div class="ul_div_card" data-detailid="' + jobDetailId + '" data-code="' + searchOtherDetail.jobComCode + '">');
                    divHtml.push('<div class="cont_block">');
                    divHtml.push('<div class="div-header"><span class="title-header">' + jobName + '</span>' + '<span class="jobs-span-list-right">' + salary + '</span>' + '</div>');
                    divHtml.push('<span class="span-item">' + intl('138774' /*发布时间 */ ) + ' : ' + outTime + '</span><span class="span-item">' + intl('205948' /* 招聘企业 */ ) + ' : ' + jumpItem + '</span><span class="span-item">' + intl('214189' /*学历要求 */ ) + ' : ' + needEdu + '</span></br>');
                    divHtml.push('<span class="span-item">' + intl('138583' /*工作地点 */ ) + ' : ' + workPlace + '</span><span class="span-item">' + intl('214188' /* 经验要求 */ ) + ' : ' + needExp + '</span>');
                    divHtml.push('</div></div></div>');
                    $('.ul-cont').append(divHtml.join(''));
                }
            } else {
                $('#hotJobList').empty(); //只有第一次进才清空
                $('#hotJobList').append('<span style="display: block;padding-bottom: 20px;">--<span>');
            }
        }, searchOtherDetail.loadError);
    },
    loadError: function() {
        // TODO err
    },
    pageTurning: function(changePage, selpagesize) {
        //翻页功能
        if (changePage) { //翻页功能
            var buttonArr = [];
            buttonArr.push('<div class="dataTables_paginate paging_simple_numbers">');
            var allNum = Records;
            var pageNum = Math.ceil(Records / selpagesize);
            var jumpfoward = '<a id="jumpForad" class="paginate_button" data-num="' + pageNum + '"><</a>';
            var jumpafter = '<a id="jumpAfter" class="paginate_button" data-num="' + pageNum + '">></a>';
            var ellipsisSpan = '<span class="ellipsis">…</span>';
            buttonArr.push(jumpfoward);
            var buttonItem = '';
            if (pageNum < 8) {
                for (var bi = 1; bi <= pageNum; bi++) {
                    buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                    buttonArr.push(buttonItem);
                }
            } else {
                buttonItem = '<a class="paginate_button ' + (changePage == 1 ? 'page-foucs' : '') + '">' + 1 + '</a>';
                buttonArr.push(buttonItem);
                if (changePage <= 4) {
                    for (var bi = 2; bi <= 5; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                } else if (changePage >= pageNum - 3) {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = pageNum - 4; bi < pageNum; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                } else {
                    buttonArr.push(ellipsisSpan);
                    for (var bi = changePage - 1; bi < changePage + 2; bi++) {
                        buttonItem = '<a class="paginate_button ' + (bi == changePage ? 'page-foucs' : '') + '">' + bi + '</a>';
                        buttonArr.push(buttonItem);
                    }
                    buttonArr.push(ellipsisSpan);
                }
                buttonItem = '<a class="paginate_button ' + (changePage == pageNum ? 'page-foucs' : '') + '">' + pageNum + '</a>';
                buttonArr.push(buttonItem);
            }
            buttonArr.push(jumpafter);
            buttonArr.push('  跳至 <input class="pagiate-page-num" id="hotjob-changePage" type="text"> 页 ');
            buttonArr.push('</div>');
            $('.change-page').append(buttonArr.join(""));
        }
    },
}



/* 国际化 ,所有自己的代码都在写在这个回调函数后*/

if (window.wind && wind.langControl) {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') < 0) {
        wind.langControl.lang = 'zh';
        wind.langControl.locale = 'zh';
        wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
            Common.international();
            searchOtherDetail.init();
        }, function() {
            // console.log('error');
        });
    } else {
        wind.langControl.initByJSON && wind.langControl.initByJSON('../locale/', function(args) {
            Common.international();
            searchOtherDetail.init();
        }, function() {
            // console.log('error');
        });
        // 终端多语言设置修改时会触发 ServerFunc(func = NotifyLocaleChanged)
        // 使用 addServerFunc 避免直接覆盖 window.ServerFunc 导致冲突
        if ($.client && $.client.addServerFunc) {
            $.client.addServerFunc('NotifyLocaleChanged', function(data) {
                // data {func:'NotifyLocaleChanged',locale:'zh-CN' // 'en-US' }
                /**
                 * 切换wft系统语言时 重刷页面
                 */
                location.search = (data.locale === 'en-US') ? wind.uri(location.href).query('lang', 'en').search : wind.uri(location.href).query('lang', 'cn').search;
            });
        }
    }
    window.intl = wind.langControl.intl;
}