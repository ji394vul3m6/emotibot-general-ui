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
define("COOKBOOK_LINK", $cookbook_link);
//$_COOKBOOK_CONTENT_HOST = "192.168.1.125";

// 1
$page_info = get_default_page_info();
// 2.
$find_info = find_page_by_id($_COOKBOOK_CONTENT_HOST, $_REQUEST["id"], $page_info);
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

function find_page_by_id($cb_host, $page_id, $page_info) 
{
	#$url="http://".$_SERVER['HTTP_HOST'].":14201/cb/V1/find?type=page&pageid=".$page_id;
	#$url="http://".$_SERVER['SERVER_NAME'].":14201/cb/V1/find?type=page&pageid=".$page_id;
	$url=COOKBOOK_LINK.$page_id;
	#$url="http://".$_SERVER['remote_addr'].":14201/cb/V1/find?type=page&pageid=".$page_id;
	$jsonString = file_get_contents($url);
	#$jsonString = curl_get_contents($url);
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
	$result = $obj->{"result"};

	// title
	$page_info["{title}"] = $result->{"name"};	
	$page_info["{photo}"] = $result->{"photo"};	

	// explain
	$explain_string = "";
	$explain_json = $result->{"explain"};
	foreach($explain_json as $line) {
		$explain_string = $explain_string."<em>".$line."</em>";
	}
	$page_info["{explain}"] = $explain_string;

	// characteristic
	$characteristic_json = $result->{"characteristic"};
	$page_info["{time}"] = $characteristic_json->{"耗时"};
	$page_info["{taste}"] = $characteristic_json->{"口味"};
	$page_info["{technique}"] = $characteristic_json->{"工艺"};
	$page_info["{level}"] = $characteristic_json->{"难度"};

	#ingredients
	$temp1_string = "";
	$temp2_string = "";
	$ingredients_json = $result->{"ingredients"};
	foreach($ingredients_json as $key => $value) {
	  	$item_string ="<tr><td>".$key."</td><td class=\"Right\">".$value."</td></tr>";
	   	if ("适量" == $value) {
		 	$temp2_string = $temp2_string.$item_string;
		}
		else {
		 	$temp1_string = $temp1_string.$item_string;
		}
	}
	$page_info["{ingredients}"] = $temp1_string.$temp2_string;

	// steps	
	$temp_string = "";
	$steps_json = $result->{"steps"};
	foreach($steps_json as $item_json) {
	   	$item_string ="<li><span> 步骤 ".$item_json->{"num"}."</span><div class=\"delicious\" ><img src=\"".$item_json->{"img"}."\"></div> <p>".$item_json->{"text"}."</p></li>";
		$temp_string = $temp_string.$item_string;
	}
	$page_info["{steps}"] = $temp_string;


	// tip
	$tips_string = "";
	$tips_json = $result->{"tip"};
	foreach($tips_json as $line) {
		$tips_string = $tips_string."<li>".$line."</li>";
	}
	if( $tips_string == "") {
		$tips_string = "<li>做菜木有捷径，慢工出细活，慢慢加油哦~</li>";
	}
	$page_info["{tips}"] = $tips_string;
	
	#echo $jsonString;
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
