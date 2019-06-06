// Define all the AWS services here
const SERVICES = [
	"acm",
	"apigateway",
	"artifact",
	"athena",
	"batch",
	"cloudformation",
	"cloudfront",
	"cloudhsm",
	"cloudsearch",
	"cloudtrail",
	"cloudwatch",
	"codebuild",
	"codecommit",
	"codedeploy",
	"codepipeline",
	"codestar",
	"config",
	"connect",
	//"cognito", // Amazon did this one!
	"datapipeline",
	"directconnect",
	//"directoryservice", // Amazon did this one!
	"devicefarm",
	"discovery",
	"dms",
	"dynamodb",
	"ec2",
	"es",
	"efs",
	"ecs",
	"elasticache",
	"elastictranscoder",
	"elasticbeanstalk",
	"elasticmapreduce",
	"glacier",
	"gamelift",
	"glue",
	//"greengrass", // unique URL
	//"iam", // Amazon did this one!
	"iot",
	"iotsitewise",
	"importexport",
	"inspector",
	"kinesis",
	//"lambda", // Amazon did this one!
	"lex",
	"ls",
	//"macie", // unique URL
	"machinelearning",
	"managed-services",
	"mediaconvert",
	"medialive",
	"migrationhub",
	"mobilehub",
	"opsworks",
	"pinpoint",
	"polly",
	"rds",
	"redshift",
	"rekognition",
	"route53",
	"s3",
	"servermigration",
	"servicecatalog",
	"ses",
	"sns",
	"sqs",
	"states",
	"storagegateway",
	"trustedadvisor",
	"swf",
	"waf",
	"workspaces", // This one is bugged for some unknown reason (see if statement below)
	"workmail",
	"vpc",
	"xray",
	"zocalo",
];

// Look for the string blocks right after the 'amazon.com/' (ec2/s3/iam/ses/etc...)
let reg = /:\/\/([a-z0-9.-]*)\/([a-z0-9.-]*)\/([a-z0-9.-]*)\/*/g;

// Break the URL into parts and capture the string after the 'amazon.com/' as awsServiceName
let captureGroupArray = Array.from( document.URL.matchAll(reg) );
let awsServiceName = captureGroupArray[0][2];

// For Codesuite URLs (Codebuild/CodeDeploy/CodePipeline/etc...), we need to break the URL apart further to work
if (awsServiceName == 'codesuite') {
	awsServiceName = captureGroupArray[0][3];
}


// We have found a match in the URL!
if (SERVICES.hasOwnProperty(awsServiceName)) {

	let awsService = SERVICES[awsServiceName];

	// Ok handle the favicon for a few different situations
	
	if (awsServiceName == 'workspaces' || awsServiceName == 'managed-services') {

		// You may be wondering why this code block is exactly the same as the else statement.  That's because for some
		// unknown reason, `if ('workspaces' == 'cloudsearch' || 'swf')` resolves to true and it is driving me crazy so
		// I'm just forcing the thing to work here.  Uuuuuugh
		// Try it though!  Just  delete this block and start the if statement at `if (awsService == 'cloudsearch' || 'swf')`
		// and see what happens!

		let linkElements = document.getElementsByTagName('link');		
		for (let i = 0; i < linkElements.length; i++) {
			if (linkElements[i].getAttribute('rel') == 'icon') {
				linkElements[i].setAttribute('type', 'image/png');
				linkElements[i].setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));
			}

			if (linkElements[i].getAttribute('rel') == 'shortcut icon') {
				linkElements[i].setAttribute('type', 'image/png');
				linkElements[i].setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));
			}
		}

	} else if (awsService == 'cloudsearch' || 'swf') {

		// In these few cases, we need to actually add the favicon tag, because no one at Amazon did this yet!

		// Build the icon and shortcut icon tags so we can add them inside the head tag
		let iconNode = document.createElement('link');
		iconNode.setAttribute('rel', 'icon');
		iconNode.setAttribute('type', 'image/png');
		iconNode.setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));
		let shortcutIconNode = document.createElement('link');
		shortcutIconNode.setAttribute('rel', 'shortcut icon');
		shortcutIconNode.setAttribute('type', 'image/png');
		shortcutIconNode.setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));

		// Add the tags we just made to the head tag

		document.getElementsByTagName('head')[0].appendChild(iconNode);
		document.getElementsByTagName('head')[0].appendChild(shortcutIconNode);

	} else {

		// We have a favicon on the page, so just update the favicon tags

		// Get all the <link> tags
		let linkElements = document.getElementsByTagName('link');

		for (let i = 0; i < linkElements.length; i++) {

			// There are 2 tags that control the favicon.  Update them to be the correct favicon
			if (linkElements[i].getAttribute('rel') == 'icon') {
				linkElements[i].setAttribute('type', 'image/png');
				linkElements[i].setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));
			}

			if (linkElements[i].getAttribute('rel') == 'shortcut icon') {
				linkElements[i].setAttribute('type', 'image/png');
				linkElements[i].setAttribute('href', chrome.runtime.getURL(`icons/${awsService.href}`));
			}
		}
	}
}