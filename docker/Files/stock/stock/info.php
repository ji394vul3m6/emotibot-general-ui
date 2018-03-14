<?php 
// 菜谱Html 生成代码

// ini_set("display_errors", "On");
// error_reporting(E_ALL | E_STRICT);
// 网内内容服务器地址 (localhost)
define("FILE_NAME", "../../DB.conf");
define("DELAY_SEC", 3);
define("FILE_ERROR", -2);
if (file_exists(FILE_NAME)) {
   include(FILE_NAME);
}
else {
   sleep(DELAY_SEC);
   echo FILE_ERROR;
   return;
}
define("STOCK_QUERY_LINK", $stockquery_link);

#$STOCK_QUERY_LINK = "http://192.168.1.125:14001/stock/V1/query?do=detils"
//$stock_host = "http://192.168.1.127:14001/stock/V1/query?do=detils";
// 1
$page_info = get_default_page_info();
// 2.
$find_info = find_page_by_id(STOCK_QUERY_LINK, $_REQUEST["id"], $page_info);
#echo $page_info;
// 3.
if( $find_info != NULL )
{
   echo_page_data("template.html", $find_info);
}


function curl_get_contents($url)
{
    $ch = curl_init();
    curl_seto($ch, CURLOPT_HEADER, 0);
    curl_seto($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_seto($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}


function get_default_page_info()
{
	
	$page_info = array();

	$page_info["{title}"] = "";
	$page_info["{explain}"] = "";
	
	$page_info["{time}"] = "";
	$page_info["{taste}"] = ""; 
	$page_info["{technique}"] = "";
	$page_info["{level}"] = "";
	
	return $page_info;

}

function find_page_by_id($host, $id, $page_info) 
{
	$url=$host."&id=".$id;
	$jsonString = file_get_contents($url);
	if ( $jsonString == NULL) {
		echo $url;
	   	return NULL;
	}
	
	$obj = json_decode($jsonString);
	if( $obj == NULL) {
		echo $url;
		return NULL;
	}

	if( 0 != $obj->{"status"}) {
		return NULL;
	}
	$result = $obj->{"result"}[0];
	
	$dapan = $result->{"dapandata"};
	$data_ = $result->{"data"};
	
	// title
	$page_info["{name}"] = $dapan->{"name"};	
	$page_info["{code}"] = substr($data_->{"gid"},2, 100);	
	$page_info["{date}"] = $data_->{"date"};	
	$page_info["{time}"] = $data_->{"time"};


	// images
	$go_pic = $result->{"gopicture"};

	$page_info["{image_min}"] = $go_pic->{"minurl"};
	$page_info["{image_day}"] = $go_pic->{"dayurl"};
	$page_info["{image_week}"] = $go_pic->{"weekurl"};
	$page_info["{image_month}"] = $go_pic->{"monthurl"};

	// values
	$todayStartPri  = $data_->{"todayStartPri"};
	$yestodEndPri  = $data_->{"yestodEndPri"};

	$todayMax  = $data_->{"todayMax"};
	$todayMin = $data_->{"todayMin"};

	$dot = $dapan->{"dot"};
	$rate = $dapan->{"rate"};
	$nowPic = $dapan->{"nowPic"};


	$page_info["{dot}"] = sprintf("%.2f", $dot);

	$page_info["{todayStartPri}"] = sprintf("%.2f", $todayStartPri);
	$page_info["{yestodEndPri}"] = sprintf("%.2f", $yestodEndPri);
	$page_info["{todayMax}"] = sprintf("%.2f", $todayMax);
	$page_info["{todayMin}"] = sprintf("%.2f", $todayMin);
	$page_info["{traNumber}"] = $dapan->{"traNumber"}."手";
	$page_info["{traAmount}"] = sprintf("%.1f万", $dapan->{"traAmount"}/10.0);

	if($nowPic >= 0) {
		$page_info["{nowPic}"] = sprintf("+%.2f", $nowPic);
	}
	else {
		$page_info["{nowPic}"] = sprintf("%.2f", $nowPic);
	}


	if($rate >= 0) {
		$page_info["{rate}"] = sprintf("+%.2f", $rate);
	}
	else {
		$page_info["{rate}"] = sprintf("%.2f", $rate);
	}

	// view color

	$page_info["{dot-class}"] = "priceup";
	if($dot > $yestodEndPri) {
		#$page_info["{dot-class}"] = "lowpriceup";
		$page_info["{dot-class}"] = "priceup";
	}	
	else if($dot <  $yestodEndPri) {
		$page_info["{dot-class}"] = "pricedown";
	}	

	$page_info["{todayStartPri-class}"] = "highpriceequal";
	if($todayStartPri > $yestodEndPri) {
		$page_info["{todayStartPri-class}"] = "lowpriceup";
	}
	else if($todayStartPri < $yestodEndPri){
		$page_info["{todayStartPri-class}"] = "tpricedown";
	}

	$page_info["{todayMax-class}"] = "highpriceequal";
	if($todayMax > $yestodEndPri) {
		$page_info["{todayMax-class}"] = "lowpriceup";
	}
	else if($todayMax < $yestodEndPri){
		$page_info["{todayMax-class}"] = "tpricedown";
	}

	$page_info["{todayMin-class}"] = "highpriceequal";
	if($todayMin > $yestodEndPri) {
		$page_info["{todayMin-class}"] = "lowpriceup";
	}
	else if($todayMin < $yestodEndPri){
		$page_info["{todayMin-class}"] = "tpricedown";
	}


	return $page_info;

} 

function echo_page_data( $template_file, $page_info)
{
   	$fp = fopen( $template_file, 'r' );
	/*** loop over the file pointer ***/
	while ( !feof ( $fp) )
	{
		$line = fgets($fp);
	   	/*** read the line into a buffer ***/
		foreach ($page_info as $key => $value)
		{
		   	#echo $key;
		   	#echo $value;
			$key_pos = strpos($line, $key);
		   	if ( $key_pos > -1) {
			  	$line = str_replace($key,$value,$line);
			}
	   	}
		echo $line;
	}

	fclose($fp);
}


?>
