#!/usr/bin/perl

use strict;
use warnings;
use JSON;

my @stdin = <STDIN>;
my $inJson = join('', @stdin);

$json = decode_json $inJson;

print $json{'h'};


