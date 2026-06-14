<?php
/**
 * Master email layout — semua email dibungkus di sini.
 * Pakai inline style supaya aman di Gmail/Outlook (web).
 *
 * @var string $subject
 * @var string $body    HTML body
 */
$brand = '#00F5B8';
$bg    = '#0A0E0D';
$card  = '#111817';
$text  = '#E8F1EE';
$muted = '#8FA39D';
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= esc($subject ?? 'MellogangVisuals') ?></title>
</head>
<body style="margin:0;padding:0;background:<?= $bg ?>;font-family:Inter,Helvetica,Arial,sans-serif;color:<?= $text ?>;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:<?= $bg ?>;padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:<?= $card ?>;border-radius:16px;overflow:hidden;border:1px solid #20302C;">
        <tr>
          <td style="padding:24px 28px 8px 28px;border-bottom:1px solid #20302C;">
            <div style="font-weight:800;letter-spacing:0.04em;font-size:14px;color:<?= $brand ?>;text-transform:uppercase;">
              Mellogang Visuals
            </div>
            <div style="color:<?= $muted ?>;font-size:12px;margin-top:4px;">
              Photo &amp; Video Maker
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px;color:<?= $text ?>;font-size:15px;line-height:1.6;">
            <?= $body ?>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 28px;border-top:1px solid #20302C;color:<?= $muted ?>;font-size:12px;line-height:1.5;">
            Email otomatis dari MellogangVisuals. Kalau tidak masuk inbox, cek
            folder <strong>Spam</strong> atau <strong>Promosi</strong>.
            <br><br>
            &copy; <?= date('Y') ?> MellogangVisuals.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
