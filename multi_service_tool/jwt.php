<?php
// -----------------------------------------------
// jwt.php — JWT Token Helper (without library)
// -----------------------------------------------


define('JWT_SECRET', 'myapp2026secretkey123');
define('JWT_EXPIRY', 3600); // 1 hour (seconds)

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}

function generateJWT($payload) {
    $header = base64UrlEncode(json_encode(["alg" => "HS256", "typ" => "JWT"]));

    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;

    $payloadEncoded = base64UrlEncode(json_encode($payload));

    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payloadEncoded", JWT_SECRET, true));

    return "$header.$payloadEncoded.$signature";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    [$header, $payload, $signature] = $parts;

    $expectedSig = base64UrlEncode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expectedSig, $signature)) return false;

    $data = json_decode(base64UrlDecode($payload), true);

    if ($data['exp'] < time()) return false; // Token expire ho gaya

    return $data;
}
?>