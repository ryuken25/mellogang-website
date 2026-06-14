<?php

namespace App\Models;

use CodeIgniter\Model;

class SocialFetchJobModel extends Model
{
    protected $table         = 'social_fetch_job';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'status', 'platforms', 'started_at', 'finished_at',
        'items_youtube', 'items_instagram', 'message', 'triggered_by', 'created_at',
    ];
    protected $useTimestamps = false;
    protected $returnType    = 'array';

    public const STATUS_QUEUED  = 'queued';
    public const STATUS_RUNNING = 'running';
    public const STATUS_DONE    = 'done';
    public const STATUS_FAILED  = 'failed';
}
