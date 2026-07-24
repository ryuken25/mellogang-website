<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;

class ErrorController extends BaseController
{
    /**
     * Branded 404 — dipasang via $routes->set404Override().
     * Request API (api/* atau Accept: application/json) dapat JSON,
     * sisanya dapat halaman 404 bertema.
     */
    public function show404()
    {
        $this->response->setStatusCode(404);

        $path     = uri_string();
        $wantJson = str_starts_with($path, 'api/')
            || str_contains((string) $this->request->getHeaderLine('Accept'), 'application/json');

        if ($wantJson) {
            return $this->response->setJSON([
                'ok'      => false,
                'error'   => 'not_found',
                'message' => 'Route tidak ditemukan.',
            ]);
        }

        return $this->response->setBody(view('errors/custom_404', [
            'title' => '404 — Halaman Tidak Ditemukan',
        ]));
    }
}
