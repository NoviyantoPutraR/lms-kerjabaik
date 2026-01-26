$mappings = @{
    "@/fitur/auth"        = "@/fitur/autentikasi"
    "@/fitur/courses"     = "@/fitur/kursus"
    "@/fitur/assessments" = "@/fitur/penilaian"
    "@/fitur/dashboard"   = "@/fitur/dasbor"
    "@/fitur/instructor"  = "@/fitur/instruktur"
    "@/fitur/reports"     = "@/fitur/laporan"
    "@/fitur/users"       = "@/fitur/pengguna"
    "@/shared/components" = "@/shared/komponen"
    "@/shared/types"      = "@/shared/tipe"
    "../components/"      = "../komponen/"
    "./components/"       = "./komponen/"
    "/komponen/"          = "/komponen/"
}

$files = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx, *.css

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false
    
    foreach ($old in $mappings.Keys) {
        if ($content.Contains($old)) {
            $content = $content.Replace($old, $mappings[$old])
            $changed = $true
        }
    }
    
    if ($changed) {
        $content | Set-Content $file.FullName -NoNewline
    }
}
