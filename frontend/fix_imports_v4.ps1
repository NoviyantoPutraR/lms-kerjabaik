$mappings = @{
    "@/features"           = "@/fitur"
    "@/components"         = "@/komponen"
    "@/types"              = "@/tipe"
    "@/lib"                = "@/pustaka"
    "@/auth"               = "@/autentikasi"
    "@/courses"            = "@/kursus"
    "@/assessments"        = "@/penilaian"
    "@/dashboard"          = "@/dasbor"
    "@/instructor"         = "@/instruktur"
    "@/reports"            = "@/laporan"
    "@/users"              = "@/pengguna"
    "from '../types'"      = "from '../tipe'"
    "from './types'"       = "from './tipe'"
    "from '../components'" = "from '../komponen'"
    "from './components'"  = "from './komponen'"
    "import '../types'"    = "import '../tipe'"
    "import './types'"     = "import './tipe'"
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
