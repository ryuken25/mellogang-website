<?php

namespace App\Models;

use CodeIgniter\Model;

class SocialPostModel extends Model
{
    protected $table         = 'social_post';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'platform', 'external_id', 'type', 'title', 'caption',
        'media_url', 'thumbnail_url', 'permalink', 'posted_at',
        'fetched_at', 'is_featured', 'raw',
    ];
    protected $useTimestamps = false;
    protected $returnType    = 'array';

    public const PLATFORM_YOUTUBE   = 'youtube';
    public const PLATFORM_INSTAGRAM = 'instagram';
}
